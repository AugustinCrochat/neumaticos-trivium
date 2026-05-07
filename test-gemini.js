const fs = require('fs');
async function test() {
  const apiKey = process.env.GOOGLE_AI_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: `Test prompt. Devuelve {"ancho": 205, "perfil": 55, "aro": 16}.` },
          // Send a tiny valid base64 1x1 jpeg
          { inline_data: { mime_type: 'image/jpeg', data: "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=" } }
        ],
      }],
      generationConfig: { temperature: 0, response_mime_type: "application/json" },
    }),
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
test();
