require('dotenv').config();
const fetch = require('node-fetch');

const token = process.env.VITE_COZE_API_TOKEN;
console.log('Testing new service token:', token ? token.substring(0, 10) + '...' : 'undefined');

const testData = {
  bot_id: '7573579561607331840',
  user: 'test_user',
  query: '我想学习python',
  chat_history: [],
  stream: false
};

fetch('https://api.coze.cn/open_api/v2/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(body => {
  console.log('API Response Status:', body.code);
  if (body.code === 0) {
    console.log('✅ Token验证成功！');
    console.log('Response message:', body.message?.slice(0, 100) + '...');
  } else {
    console.log('❌ Token验证失败:', body.msg);
  }
})
.catch(err => {
  console.error('Error:', err.message);
});