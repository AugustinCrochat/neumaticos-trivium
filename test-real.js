const fs = require('fs');
async function test() {
  const apiKey = process.env.GOOGLE_AI_KEY;
  const imgRes = await fetch("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Tire_code_P215_65_R15_89H.jpg/640px-Tire_code_P215_65_R15_89H.jpg");
  const buffer = await imgRes.arrayBuffer();
  const b64 = Buffer.from(buffer).toString('base64');
  
  const prompt = `Devuelve el ancho, perfil y aro.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: b64 } }
        ],
      }],
      generationConfig: { temperature: 0 },
    }),
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
test();
