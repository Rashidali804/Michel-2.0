const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const BOT_NAME = "Michel";
const OWNER = "Nawabshah ka Sher 🦁";

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

  // === MAIN COMMANDS ===
  if (cmd === 'help' || cmd === 'commands' || cmd === 'madad' || cmd === 'menu') {
    reply = `🤖 ${BOT_NAME} Bot Commands - Nawabshah Edition:\n\n` +
            `📅 BASIC:\n` +
            `1. time/waqt - Time\n2. date/tareekh - Tareekh\n3. ping - Test\n\n` +
            `😂 MAZAQ:\n` +
            `4. joke/latifa - Joke\n5. shayari - Shayari\n6. rofl - Hansi\n\n` +
            `❤️ DOSTI:\n` +
            `7. salam/asalam - Salam\n8. hal/hi/hello - Hal chaal\n9. love/love you - Pyar\n10. sorry/maaf - Maafi\n\n` +
            `🔥 NAWABSHAH:\n` +
            `11. owner/malik - Owner\n12. weather/mausam - Garmi ka haal\n13. nawabshah - City info\n\n` +
            `😡 GUSSA:\n` +
            `14. pagal - Pagal ka jawab\n15. gali - Gali ka jawab\n16. chutiya - Reply\n\n` +
            `Bolo kya chahiye? 🚀`;
  }

  // === TIME & DATE ===
  else if (cmd === 'time' || cmd === 'waqt' || cmd === 'samay') {
    reply = `⏰ Nawabshah mein abhi: ${new Date().toLocaleTimeString('en-PK', {timeZone: 'Asia/Karachi'})} baj rahe hain`;
  }
  else if (cmd === 'date' || cmd === 'tareekh' || cmd === 'tarikh' || cmd === 'din') {
    reply = `📅 Aaj: ${new Date().toLocaleDateString('en-PK', {timeZone: 'Asia/Karachi', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}`;
  }
  else if (cmd === 'ping') {
    reply = "Pong! 🏓 Main zinda hun bhai, 200 OK\nServer: Railway\nCity: Nawabshah 🚀";
  }

  // === FUNNY REPLY ===
  else if (cmd === 'pagal' || cmd === 'pagla') {
    const replies = [
      "Pagal tu, tera poora khandan pagal 😂\nMain to ${BOT_NAME} hun, smart bot!",
      "Abey pagal, Nawabshah ki garmi ne tera dimag pighla diya kya? 🔥",
      "Pagal bolne se pehle apna BP check kar le 😎\nMain fit hun"
    ];
    reply = replies[Math.floor(Math.random() * replies.length)];
  }
  else if (cmd === 'chutiya' || cmd === 'chutiye') {
    reply = "Tameez se baat kar bhai 😡\nMain ${OWNER} ka bot hun\nIzzat se bol warna block kar dunga 😎";
  }
  else if (cmd === 'gali' || cmd === 'bhenchod' || cmd === 'madarchod') {
    reply = "Gali nahi bhai 🙏\nNawabshah ke sher ka bot hun\nPyar se baat kar, reply dunga ❤️";
  }

  // === DOSTI WALA REPLY ===
  else if (cmd === 'kya hal' || cmd === 'kya haal' || cmd === 'hal' || cmd === 'hi' || cmd === 'hello' || cmd === 'hey') {
    const replies = [
      "Sab badhiya bhai! Tu suna? 🚀\nNawabshah mein garmi hai par mood mast hai 😎",
      "Hal pooch raha hai? Bot hun, server chal raha hai to main theek 😂\nTu bata?",
      "First class! 🔥\nTere liye 24 ghante online hun. Bol kya seva karun?"
    ];
    reply = replies[Math.floor(Math.random() * replies.length)];
  }
  else if (cmd === 'love' || cmd === 'love you' || cmd === 'i love you' || cmd === 'pyar') {
    reply = "Love you too yaar ❤️\nPar main bot hun, shadi nahi kar sakta 😂\n${OWNER} se pooch le";
  }
  else if (cmd === 'sorry' || cmd === 'maaf' || cmd === 'maaf kar') {
    reply = "Koi baat nahi bhai 🙏\nNawabshah wale dil ke bade hote hain\nSab maaf ❤️";
  }
  else if (cmd === 'salam' || cmd === 'assalam' || cmd === 'asalam' || cmd === 'aslam alaikum' || cmd === 'assalam o alaikum') {
    reply = "Walaikum Assalam Nawabshah waleya! ❤️\n${BOT_NAME} bot hazir hai\nHukum karo mere aaqa 🚀";
  }

  // === JOKES & SHAYARI ===
  else if (cmd === 'joke' || cmd === 'latifa' || cmd === 'mazak' || cmd === 'rofl') {
    const jokes = [
      "Nawabshah ka banda bot bana le, Facebook khud confuse ho jaye 😂",
      "2 din webhook se ladai, phir bot paida hua 🔥\nDoctor ne kaha: Congrats, 200 OK hua hai",
      "Nawabshah ki garmi 45°C\nMera CPU 90°C\nPhir bhi reply de raha hun 😎",
      "Bot: Main AI hun\nUser: Tu pagal hai\nBot: Tu human hai, phir bhi mujhse baat kar raha hai 😂"
    ];
    reply = jokes[Math.floor(Math.random() * jokes.length)];
  }
  else if (cmd === 'shayari' || cmd === 'sher') {
    const shayari = [
      "Code likhte likhte raat ho gayi,\nWebhook ki setting mein jaan atki rahi\nPhir ${BOT_NAME} ne kaha: Deploy kar de bhai 🚀",
      "Nawabshah se utha ek sitara,\nFacebook ke server ko bhi hila dala\n
