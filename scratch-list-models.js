
async function listModels() {
  const apiKey = 'AIzaSyBkItZ89oyFgvBmEbk-qemI2m8vh8bl5-A';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
listModels();
