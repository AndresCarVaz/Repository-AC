require('dotenv').config();
const axios = require('axios');

const model = 'gemini-2.0-flash';
const key = process.env.IA_API_KEY;

console.log('Key empieza con:', key ? key.substring(0, 10) + '...' : 'UNDEFINED');

const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

axios.post(url, {
  contents: [{ parts: [{ text: 'Di hola en espanol' }] }]
})
.then(r => {
  console.log('SUCCESS:', r.data.candidates[0].content.parts[0].text);
})
.catch(e => {
  console.error('ERROR status:', e.response ? e.response.status : 'NO_RESPONSE');
  console.error('ERROR data:', JSON.stringify(e.response ? e.response.data : e.message));
});
