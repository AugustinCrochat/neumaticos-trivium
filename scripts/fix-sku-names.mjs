import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join, extname, basename } from 'path';

const DATA_PATH = './src/lib/data.ts';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function main() {
  const text = readFileSync(DATA_PATH, 'utf-8');
  const productsStart = text.indexOf('export const PRODUCTS');
  const productsEnd = text.indexOf('export const SERVICES');
  const productsText = text.slice(productsStart, productsEnd);

  // Parse all products
  const productRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?model:\s*"([^"]+)"[\s\S]*?imageUrl:\s*\n?\s*"([^"]+)"/g;
  let match;
  let newText = text;
  let updatedCount = 0;

  while ((match = productRegex.exec(productsText)) !== null) {
    const id = match[1];
    const model = match[2];
    const oldUrl = match[3];

    if (oldUrl.startsWith('/images/products/')) {
      const filename = basename(oldUrl);
      const ext = extname(filename);
      const expectedBase = slugify(id + " " + model);
      const expectedUrl = `/images/products/${expectedBase}${ext}`;

      if (oldUrl !== expectedUrl) {
        const oldPath = join('./public', oldUrl);
        const newPath = join('./public', expectedUrl);

        console.log(`Fixing: ${oldUrl} -> ${expectedUrl}`);
        
        if (existsSync(oldPath)) {
          try {
            renameSync(oldPath, newPath);
          } catch (e) {
            console.error(`Error renaming file: ${e.message}`);
          }
        }

        // Update in text
        const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const blockRegex = new RegExp(`(id:\\s*"${escapedId}"[\\s\\S]*?imageUrl:\\s*\\n?\\s*")([^"]+)(")`, 'g');
        newText = newText.replace(blockRegex, (m, p1, p2, p3) => {
          if (p2 === oldUrl) {
            updatedCount++;
            return p1 + expectedUrl + p3;
          }
          return m;
        });
      }
    }
  }

  writeFileSync(DATA_PATH, newText, 'utf-8');
  console.log(`Updated ${updatedCount} products.`);
}

main();
