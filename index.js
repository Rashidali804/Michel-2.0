const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('./config');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Webhook Verification - GET
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED ✅');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook Messages - POST
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const text = webhookEvent.message.text;
        sendMessage(senderId, `Aap ne kaha: "${text}". Michel bot hazir hai 🚀`);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Send Message Function
function sendMessage(senderId, text) {
  axios.post(`https://graph.facebook.com/${config.API_VERSION}/me/messages`, {
    recipient: { id: senderId },
    message: { text: text }
  }, {
    params: { access_token: config.PAGE_ACCESS_TOKEN }
  }).catch(error => {
    console.error('Error sending message:', error.response?.data || error.message);
  });
}

// Start Server
app.listen(config.PORT, () => {
  console.log(`Michel Bot running on port ${config.PORT} ✅`);
});
