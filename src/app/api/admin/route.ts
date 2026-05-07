import { NextRequest, NextResponse } from 'next/server';
import { list, put, del } from '@vercel/blob';

function checkAuth(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') ?? req.headers.get('x-admin-key');
  const expected = process.env.ADMIN_KEY;
  if (!expected || key !== expected) return false;
  return true;
}

// GET /api/admin?key=X&cursor=Y — list dataset blobs
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;
  const { blobs, cursor: nextCursor, hasMore } = await list({
    prefix: 'dataset/',
    limit: 30,
    cursor,
  });

  const items = blobs
    .filter(b => b.pathname.endsWith('.jpg'))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .map(b => {
      const filename = b.pathname.replace('dataset/', '');
      const parts = filename.replace('.jpg', '').split('_');
      const label = parts.slice(1).join('_') || 'unknown';
      const [w, p, r] = label.split('-').map(Number);
      return {
        url: b.url,
        pathname: b.pathname,
        label,
        failed: label === 'failed',
        width: isNaN(w) ? null : w,
        profile: isNaN(p) ? null : p,
        rim: isNaN(r) ? null : r,
        uploadedAt: b.uploadedAt,
      };
    });

  return NextResponse.json({ items, nextCursor, hasMore });
}

// POST /api/admin?key=X — correct a label
// body: { pathname: string, newLabel: string }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { pathname, newLabel } = await req.json();
  if (!pathname || !newLabel) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // Reconstruct old URL to fetch content
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ error: 'No blob token' }, { status: 500 });

  // List to find the blob URL for this pathname
  const { blobs } = await list({ prefix: pathname });
  const blob = blobs.find(b => b.pathname === pathname);
  if (!blob) return NextResponse.json({ error: 'Blob not found' }, { status: 404 });

  // Fetch image content
  const imgRes = await fetch(blob.url);
  if (!imgRes.ok) return NextResponse.json({ error: 'Could not fetch image' }, { status: 500 });
  const buffer = await imgRes.arrayBuffer();

  // Build new filename: keep timestamp, replace label
  const filename = pathname.replace('dataset/', '');
  const timestamp = filename.split('_')[0];
  const newFilename = `${timestamp}_${newLabel}.jpg`;

  // Upload with new name
  const newBlob = await put(`dataset/${newFilename}`, Buffer.from(buffer), {
    access: 'public',
    contentType: 'image/jpeg',
  });

  // Delete old
  await del(blob.url);

  return NextResponse.json({ ok: true, newUrl: newBlob.url });
}
