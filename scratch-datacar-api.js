const https = require('https');

async function testDatacarAPI(patente) {
  const url = `https://api.datacar.com.ar/api/v1/Vehicles?domain=${patente}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data.substring(0, 500)
        });
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

testDatacarAPI("AD762AA").then(console.log);
