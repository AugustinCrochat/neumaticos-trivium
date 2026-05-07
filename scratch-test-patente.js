const https = require('https');

async function testMeli(patente) {
  // Let's test a known open API or simple HTML scrape.
  // Actually, many people use https://api.datacar.com.ar/ (needs auth)
  // Let's try an open one if it exists.
  // We can just use Kavak's public endpoint if it's open.
  const url = `https://api.kavak.com/b2c/ar/vehicles/license-plate/${patente}`;
  
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

testMeli("AD762AA").then(r => console.log(r.status, r.data.substring(0, 200)));
