"use client";

import { useState, useEffect, useCallback } from "react";

interface BlobItem {
  url: string;
  pathname: string;
  label: string;
  failed: boolean;
  width: number | null;
  profile: number | null;
  rim: number | null;
  uploadedAt: string;
}

function LabelForm({ item, adminKey, onSaved }: { item: BlobItem; adminKey: string; onSaved: () => void }) {
  const [w, setW] = useState(item.width?.toString() ?? "");
  const [p, setP] = useState(item.profile?.toString() ?? "");
  const [r, setR] = useState(item.rim?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    const newLabel = `${w}-${p}-${r}`;
    await fetch(`/api/admin?key=${adminKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: item.pathname, newLabel }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onSaved(); }, 800);
  }

  async function markFailed() {
    setSaving(true);
    await fetch(`/api/admin?key=${adminKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: item.pathname, newLabel: "failed" }),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        <input
          value={w} onChange={e => setW(e.target.value)} placeholder="Ancho"
          className="w-16 bg-navy-700 text-white text-xs font-mono text-center border border-navy-600 rounded px-1 py-1"
        />
        <span className="text-white/40 self-center">/</span>
        <input
          value={p} onChange={e => setP(e.target.value)} placeholder="Perfil"
          className="w-14 bg-navy-700 text-white text-xs font-mono text-center border border-navy-600 rounded px-1 py-1"
        />
        <span className="text-white/40 self-center">R</span>
        <input
          value={r} onChange={e => setR(e.target.value)} placeholder="Aro"
          className="w-12 bg-navy-700 text-white text-xs font-mono text-center border border-navy-600 rounded px-1 py-1"
        />
      </div>
      <div className="flex gap-1">
        <button
          onClick={save}
          disabled={saving || !w || !p || !r}
          className={`flex-1 text-xs font-bold py-1 rounded transition-colors ${saved ? "bg-green-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40"}`}
        >
          {saved ? "✓ Guardado" : saving ? "..." : "Guardar"}
        </button>
        {!item.failed && (
          <button
            onClick={markFailed}
            disabled={saving}
            className="text-xs font-bold py-1 px-2 rounded bg-red-900/50 hover:bg-red-800 text-red-400 transition-colors disabled:opacity-40"
          >
            ✗ Falló
          </button>
        )}
      </div>
    </div>
  );
}

export default function DatasetAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<BlobItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "failed" | "detected">("all");
  const [error, setError] = useState("");

  const load = useCallback(async (key: string, cursor?: string) => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ key });
    if (cursor) params.set("cursor", cursor);
    const res = await fetch(`/api/admin?${params}`);
    if (res.status === 401) { setError("Clave incorrecta"); setLoading(false); return; }
    const data = await res.json();
    setItems(prev => cursor ? [...prev, ...data.items] : data.items);
    setNextCursor(data.nextCursor);
    setHasMore(data.hasMore);
    setAuthed(true);
    setLoading(false);
  }, []);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    load(adminKey);
  }

  const filtered = items.filter(i => {
    if (filter === "failed") return i.failed;
    if (filter === "detected") return !i.failed;
    return true;
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="flex flex-col gap-3 w-full max-w-xs">
          <h1 className="text-white font-bold text-lg text-center">Dataset Admin</h1>
          <input
            type="password"
            value={adminKey}
            onChange={e => setAdminKey(e.target.value)}
            placeholder="Clave de admin"
            className="bg-navy-800 text-white border border-navy-600 rounded-lg px-4 py-3 text-sm"
          />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-bold text-xl">Dataset — {items.length} fotos</h1>
          <div className="flex gap-2">
            {(["all", "detected", "failed"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  filter === f ? "bg-orange-500 text-white" : "bg-navy-800 text-white/60 hover:text-white"
                }`}
              >
                {f === "all" ? "Todas" : f === "detected" ? "Detectadas" : "Fallidas"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(item => (
            <div key={item.pathname} className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.label} className="w-full aspect-square object-cover" />
              <div className="p-2 flex flex-col gap-2">
                <div className={`text-xs font-mono font-bold text-center ${item.failed ? "text-red-400" : "text-orange-400"}`}>
                  {item.failed ? "FALLIDA" : `${item.width}/${item.profile} R${item.rim}`}
                </div>
                <LabelForm item={item} adminKey={adminKey} onSaved={() => load(adminKey)} />
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => load(adminKey, nextCursor)}
            disabled={loading}
            className="mt-6 w-full bg-navy-800 hover:bg-navy-700 text-white font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Ver más"}
          </button>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-white/40 text-center py-12">No hay fotos en esta categoría</p>
        )}
      </div>
    </div>
  );
}
