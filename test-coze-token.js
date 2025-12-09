require('dotenv').config();
const fetch = require('node-fetch');

const token = process.env.VITE_COZE_API_TOKEN;
console.log('Testing token:', token ? token.substring(0, 10) + '...' : 'undefined');

fetch('https://api.coze.cn/open_api/v2/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bot_id: '7573579561607331840',
    user: 'test_user',
    query: 'test',
    chat_history: [],
    stream: false
  })
}).then(res => {
  console.log('Status:', res.status);
  return res.text();
}).then(body => {
  console.log('API Response:', body);
}).catch(err => {
  console.error('Error:', err.message);
});