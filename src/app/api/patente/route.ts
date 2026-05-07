import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { patente } = await req.json();

    if (!patente) {
      return NextResponse.json({ error: "Patente requerida" }, { status: 400 });
    }

    // Aquí iría la lógica real de web scraping (usando fetch, cheerio o puppeteer)
    // hacia el portal de rentas o aseguradora.
    // Como los portales cambian constantemente, simularemos la respuesta
    // basándonos en algunas patentes de prueba.

    // Normalizar patente
    const normalized = patente.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Simulación de scraping (Proof of Concept)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulamos latencia de red

    // Simulamos un motor de reglas muy básico para la demo
    let brand = "Volkswagen";
    let model = "Gol Trend";

    if (normalized.startsWith("AD") || normalized.startsWith("AF")) {
      brand = "Toyota";
      model = "Corolla Cross";
    } else if (normalized.startsWith("AB")) {
      brand = "Peugeot";
      model = "208";
    } else if (normalized.length === 6) { // Patente vieja (AAA111)
      brand = "Ford";
      model = "Fiesta";
    }

    return NextResponse.json({
      patente: normalized,
      brand,
      model,
      year: 2021,
    });
  } catch (error) {
    console.error("Error scraping patente:", error);
    return NextResponse.json({ error: "No se pudo obtener la información del vehículo" }, { status: 500 });
  }
}
