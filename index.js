const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook for messages
app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      if (webhook_event.message && webhook_event.message.text) {
        handleMessage(sender_psid, webhook_event.message);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

function handleMessage(sender_psid, received_message) {
  let text = received_message.text;
  let reply;
  const cmd = text.toLowerCase().trim();

  if (cmd === 'help' || cmd === 'commands') {
    reply = `🤖 Michel Bot Commands - Nawabshah Edition:\n\n1. time - Nawabshah ka time\n2. date - Aaj ki tareekh\n3. joke - Desi joke\n4. shayari - 2 line shayari\n5. owner - Mere baare mein\n6. salam - Special reply\n7. weather - Nawabshah ka mausam\n8. quote - Motivation\n9. naam - Tera naam bataun\n10. age - Bot ki umar\n11. ping - Test karo\n12. insta - Owner ka Insta\n\nKuch bhi bhejoge to echo kar dunga 🚀`;
  }
  else if (cmd === 'time') {
    reply = `⏰ Nawabshah mein abhi: ${new Date().toLocaleTimeString('en-PK', {timeZone: 'Asia/Karachi'})} baj rahe hain bhai`;
  }
  else if (cmd === 'date') {
    reply = `📅 Aaj ki tareekh: ${new Date().toLocaleDateString('en-PK', {timeZone: 'Asia/Karachi', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}`;
  }
  else if (cmd === 'joke') {
    const jokes = [
      "Nawabshah ka banda bot bana le, Facebook khud confuse ho jaye 😂",
      "Developer: 2 din se webhook theek kar raha hun\nBot: Main to pehle din se ready tha 😎",
      "Bug: Main chhup gaya\nDeveloper: Main dhund lunga\nBug: Railway logs mein aa 😭",
      "Nawabshah ki garmi aur mera dimag - dono 45°C pe chalte hain 🔥"
    ];
    reply = jokes[Math.floor(Math.random() * jokes.length)];
  }
  else if (cmd === 'shayari') {
    const shayari = [
      "Code likhte likhte raat ho gayi,\nWebhook ki setting mein jaan atki rahi",
      "Nawabshah se utha ek sitara,\nFacebook ke server ko bhi hila dala",
