const https = require('https');

async function testDNRPA(patente) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ patente });
    const options = {
      hostname: 'www2.jus.gov.ar',
      port: 443,
      path: '/dnrpa-site/api/radicacion', // Just a guess, usually need to check the real URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    // This is just a placeholder, real dnrpa usually has captchas.
    resolve("Needs real endpoint");
  });
}

testDNRPA("AD762AA").then(console.log);
