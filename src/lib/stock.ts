const LOW_STOCK_THRESHOLD = 4;

export function isLowStock(stock: number) {
  return stock <= LOW_STOCK_THRESHOLD;
}

export function stockLabel(stock: number) {
  if (stock === 1) return "¡Última unidad!";
  if (isLowStock(stock)) return `¡Últimas ${stock} unidades!`;
  return `${stock} disponibles en stock`;
}
