const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  const res = await fetch('https://pos-neumaticos.vercel.app/api/public/arguello/productos');
  const data = await res.json();
  const productos = data.productos;
  
  const publicImagesDir = path.join(__dirname, 'public/images/products');
  const availableImages = new Set(fs.readdirSync(publicImagesDir));

  // Find all available local images per brandSlug-modelSlug
  const localImagesByModel = {};
  for (const file of availableImages) {
    if (!file.endsWith('.webp')) continue;
    // We can't perfectly extract brand/model from filename if it has dashes, 
    // but we can map them from the products list.
  }

  // Populate localImagesByModel using the products list
  for (const p of productos) {
    const brandSlug = slugify(p.marca || "");
    const modelSlug = slugify(p.modelo || "");
    const modelKey = `${brandSlug}-${modelSlug}`;
    
    if (!p.neumatico_ancho || !p.neumatico_perfil || !p.neumatico_diametro) continue;
    const filename = `${brandSlug}-${modelSlug}-${p.neumatico_ancho}-${p.neumatico_perfil}-r${p.neumatico_diametro}.webp`;
    
    if (availableImages.has(filename)) {
      if (!localImagesByModel[modelKey]) localImagesByModel[modelKey] = [];
      localImagesByModel[modelKey].push(filename);
    }
  }

  const missing = [];
  let copiedCount = 0;

  for (const p of productos) {
    if (!p.neumatico_ancho || !p.neumatico_perfil || !p.neumatico_diametro) continue;
    if (p.imagen_url) continue; // Has external image
    
    const brandSlug = slugify(p.marca || "");
    const modelSlug = slugify(p.modelo || "");
    const modelKey = `${brandSlug}-${modelSlug}`;
    const filename = `${brandSlug}-${modelSlug}-${p.neumatico_ancho}-${p.neumatico_perfil}-r${p.neumatico_diametro}.webp`;
    
    if (!availableImages.has(filename)) {
      // It's missing. Do we have another local image for this model?
      const otherImages = localImagesByModel[modelKey];
      if (otherImages && otherImages.length > 0) {
        // Copy the first one we find
        const src = path.join(publicImagesDir, otherImages[0]);
        const dst = path.join(publicImagesDir, filename);
        fs.copyFileSync(src, dst);
        availableImages.add(filename); // Now it exists
        localImagesByModel[modelKey].push(filename);
        copiedCount++;
        console.log(`Copied ${otherImages[0]} to ${filename}`);
      } else {
        missing.push(`${p.marca} ${p.modelo}`);
      }
    }
  }

  console.log(`\nCopied: ${copiedCount}`);
  console.log("\nFALTAN FOTOS COMPLETAMENTE PARA ESTOS MODELOS (ni en POS ni local):");
  console.log(Array.from(new Set(missing)).sort().join("\n"));
}

run();
