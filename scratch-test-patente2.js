const https = require('https');

async function test123(patente) {
  const url = `https://cotizador.123seguro.com.ar/api/v1/vehicles/plate/${patente}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', e => resolve({ error: e.message }));
  });
}

test123("AD762AA").then(r => console.log(r.status, r.data.substring(0, 200)));
