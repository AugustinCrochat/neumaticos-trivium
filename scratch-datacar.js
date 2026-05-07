const https = require('https');

async function testDatacar(patente) {
  // Try calling their frontend endpoint or homepage
  const url = `https://www.datacar.com.ar/informe/${patente}`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        // Try to find the title or model
        // e.g., <title>Informe Datacar | PEUGEOT 208</title>
        const match = data.match(/<title>([^<]+)<\/title>/i);
        const matchH1 = data.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        const metaDesc = data.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        
        resolve({
          status: res.statusCode,
          headers: res.headers,
          title: match ? match[1] : null,
          h1: matchH1 ? matchH1[1] : null,
          metaDesc: metaDesc ? metaDesc[1] : null,
          snippet: data.substring(0, 300)
        });
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

testDatacar("AD762AA").then(console.log);
