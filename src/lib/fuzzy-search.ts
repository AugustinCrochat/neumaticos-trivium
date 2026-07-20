// Búsqueda liviana, sin dependencias, tolerante a errores de tipeo — pensada
// para un catálogo chico (decenas/pocos cientos de productos), no para full
// text search a escala. Cada campo de texto de cada item se parte en
// palabras; cada palabra de la búsqueda tiene que "pegar" (substring o
// distancia de edición chica) con al menos una palabra del item.

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function tokenize(text: string): string[] {
  return normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
}

// Distancia de Levenshtein clásica (DP) — suficiente para palabras cortas.
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Cuánto error de tipeo tolerar según el largo de la palabra buscada. Un
// token puramente numérico (código de producto, medida) nunca tolera
// distancia — "66010" y "66020" difieren en un solo dígito pero son
// productos totalmente distintos, tolerar ahí sería mostrar resultados mal.
function maxEditDistance(token: string): number {
  if (/^\d+$/.test(token)) return 0;
  if (token.length <= 3) return 0;
  if (token.length <= 6) return 1;
  return 2;
}

function bestWordScore(queryToken: string, words: string[]): number {
  let best = 0;
  for (const word of words) {
    if (word === queryToken) return 3;
    if (word.startsWith(queryToken)) best = Math.max(best, 2.5);
    else if (word.includes(queryToken)) best = Math.max(best, 2);
    else {
      const dist = levenshtein(queryToken, word);
      if (dist <= maxEditDistance(queryToken)) {
        best = Math.max(best, 1.5 - dist * 0.3);
      }
    }
  }
  return best;
}

// Sinónimos de categoría: nada en el nombre/marca/modelo de un producto dice
// literalmente "neumático" o "tuerca", así que sin esto esas búsquedas tan
// obvias no encontraban nada. Se agregan como texto extra al searchable de
// cada item de esa categoría, para que matcheen como cualquier otra palabra
// (incluido tolerando typos, vía el mismo matchScore).
export const CATEGORY_TAGS = {
  tire: "neumatico neumaticos cubierta cubiertas goma gomas llanta llantas rueda ruedas",
  accessory: "tuerca tuercas antirrobo antirrobos bulon bulones birlo birlos seguro",
};

/**
 * Puntaje de match entre una búsqueda y el texto searchable de un item.
 * 0 = no matchea (algún token de la búsqueda no aparece ni parecido).
 * Mayor puntaje = mejor match (para ordenar resultados).
 */
export function matchScore(query: string, searchableText: string): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;
  const words = tokenize(searchableText);

  let total = 0;
  for (const token of queryTokens) {
    const score = bestWordScore(token, words);
    if (score === 0) return 0; // todas las palabras de la búsqueda tienen que pegar con algo
    total += score;
  }
  return total;
}
