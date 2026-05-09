import fs from 'fs';

const clientId = 'bX2jerGwdJU4JGXi2tWTh6xsiAPFfz4H';
const clientSecret = 'ov7QvdHNDezPjzTz';

async function getToken() {
  const tokenUrl = 'https://api.michelin.com/idp/v1/internal/oauth/token/accesstoken?grant_type=client_credentials';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const data = await res.json();
  return data.access_token;
}

async function testScan() {
  const token = await getToken();
  
  const paths = [
    '/',
    '/scan',
    '/sidewall',
    '/recognize',
    '/api/v1/scan',
    '/images/scan',
    '/process'
  ];
  
  for (const path of paths) {
    try {
      const url = `https://api.michelin.com/tire-size-recognition/v1${path}`;
      const res = await fetch(url, { method: 'GET', headers: { 'Authorization': `Bearer ${token}`, 'apikey': clientId } });
      const text = await res.text();
      console.log(`GET ${path} -> ${res.status} ${text.substring(0, 100)}`);
    } catch (err) {}
  }
}

testScan();