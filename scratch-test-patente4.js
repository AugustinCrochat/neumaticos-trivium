const https = require('https');

async function test(patente) {
  // Try https://api.verifik.co/v2/co/vehicle ? No, that's Colombia.
  // What about checking AGIP?
  const url = `https://lbcp.agip.gob.ar/Consultas/Patentes/`;
  // Without CSRF and session, AGIP will fail.
  console.log("Too complex to test blindly in node.");
}

test("AD762AA");
