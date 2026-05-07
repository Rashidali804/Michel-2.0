const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const BOT_NAME = "Rashid";
const OWNER = "Nawabshah ka Badshah 👑";

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

  // === MAIN MENU ===
  if (cmd === 'help' || cmd === 'commands' || cmd === 'menu' || cmd === 'list') {
    reply = `🤖 ${BOT_NAME} Bot - Nawabshah ka Entertainer 😂\n\n` +
            `🎮 GAMES:\n` +
            `1. dice - Paasa pheko\n2. coin - Toss kar\n3. number - 1-100 guess\n4. rps - Rock Paper Scissor\n\n` +
            `😂 BAKWAS:\n` +
            `5. bakwas - Bakwas sun\n6. insult - Beizzati kar\n7. tareef - Tareef sun\n8. roast - Roast karun?\n\n` +
            `💰 PAISA:\n` +
            `9. paisa - Paisa chahiye?\n10. ameer - Ameer kaise banu\n11. gareeb - Gareebi ka dukh\n\n` +
            `🔥 SPECIAL:\n` +
            `12. biryani - Biryani ki baat\n13. chai - Chai pilao\n14. sutta - Sutta ka scene\n15. dosti - Dosti karoge?\n\n` +
            `Bolo bhai kya karun? 🚀`;
  }

  // === GAMES ===
  else if (cmd === 'dice' || cmd === 'paasa') {
    const dice = Math.floor(Math.random() * 6) + 1;
    reply = `🎲 Paasa phek diya: ${dice}\n\n${dice === 6? 'Jeet gaya bhai! 🔥' : dice === 1? 'Haye bechara 😂' : 'Thik hai chalega'}`;
  }
  else if (cmd === 'coin' || cmd === 'toss') {
    const coin = Math.random() > 0.5? 'Head' : 'Tail';
    reply = `🪙 Toss ka result: ${coin}\n\n${coin === 'Head'? 'Tu jeeta! 🎉' : 'Main jeeta! 😎'}`;
  }
  else if (cmd === 'number' || cmd === 'num') {
    const num = Math.floor(Math.random() * 100) + 1;
    reply = `🔢 Mera number: ${num}\n\nAb tu apna bata, dekhte hain kaun zyada 😂`;
  }
  else if (cmd === 'rps' || cmd === 'rock' || cmd === 'paper' || cmd === 'scissor') {
    const choices = ['Rock 🪨', 'Paper 📄', 'Scissor ✂️'];
    const bot = choices[Math.floor(Math.random() * 3)];
    reply = `Maine chuna: ${bot}\n\nTu kya chunega? Phir se 'rps' likh 😂`;
  }

  // === BAKWAS ZONE ===
  else if (cmd === 'bakwas') {
    const bakwas = [
      "Nawabshah ki garmi mein anda ubal jaye, par tera dimag nahi 🔥😂",
      "Tujhe pata hai? Bot hone ke baad bhi main tujhse zyada kaam ka hun 😎",
      "2 din se tu bot bana raha hai, main 2 sec mein reply de raha hun 🚀",
      "Suna hai Nawabshah mein sher rehte hain\nPhir tu billi kyu hai? 😹"
    ];
    reply = bakwas[Math.floor(Math.random() * bakwas.length)];
  }
  else if (cmd === 'insult' || cmd === 'beizzati') {
    const insult = [
      "Teri shakal dekh ke WiFi bhi disconnect ho jata hai 😂",
      "Tu itna slow hai ke snail bhi tujhe overtake kar de 🐌",
      "Tera dimaag airplane mode pe hai kya? Koi signal nahi aa raha 😂",
      "Nawabshah ki garmi bhi tujhse zyada useful hai 🔥"
    ];
    reply = insult[Math.floor(Math.random() * insult.length)];
  }
  else if (cmd === 'tareef' || cmd === 'tarif') {
    const tareef = [
      "Bhai tu to Nawabshah ka hero hai! 🦁\
