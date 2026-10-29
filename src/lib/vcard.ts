import { SITE_URL, type Branch } from "./config";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/**
 * Tarjeta de contacto (.vcf) de una sucursal, para que la persona nos agende el
 * WhatsApp. Con el contacto guardado, el menú de compartir del teléfono ofrece
 * "Neumáticos Trivium …" directo, sin buscar el número.
 */
export function branchVCard(branch: Branch): string {
  const digits = branch.whatsapp.replace(/\D/g, "");
  const tel = `+${digits}`;
  const lineas = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(branch.name)}`,
    `N:;${esc(branch.name)};;;`,
    "ORG:Neumáticos Trivium",
    // waid enlaza el número con WhatsApp en los teléfonos que lo entienden.
    `TEL;TYPE=CELL;waid=${digits}:${tel}`,
  ];
  const fijo = branch.phone.replace(/[^\d+]/g, "");
  if (fijo && fijo.replace(/\D/g, "") !== digits) lineas.push(`TEL;TYPE=WORK,VOICE:${fijo}`);
  lineas.push(
    `ADR;TYPE=WORK:;;${esc(branch.address)};${esc(branch.city)};${esc(branch.province)};${esc(branch.postalCode ?? "")};Argentina`,
    `URL:${SITE_URL}/sucursales/${branch.id}`,
    "END:VCARD"
  );
  return lineas.join("\r\n");
}

/** Baja el .vcf de la sucursal (en el celular abre "Agregar contacto"). */
export function descargarContacto(branch: Branch) {
  const blob = new Blob([branchVCard(branch)], { type: "text/vcard;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${branch.id === "arguello" ? "neumaticos-trivium-arguello" : `neumaticos-trivium-${branch.id}`}.vcf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}
