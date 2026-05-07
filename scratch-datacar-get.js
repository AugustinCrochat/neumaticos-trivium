const https = require('https');

async function test() {
  const url = `https://www.datacar.com.ar/solicitar-informe-datacar?domainInput=AD762AA`;
  
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, data: data.substring(0, 500) }));
    });
  });
}

test().then(console.log);
