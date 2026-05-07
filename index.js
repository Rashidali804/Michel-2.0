const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

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

  if (cmd === 'help') {
    reply = `🤖 Michel Bot Commands:\n1. time - Time\n2. date - Tareekh\n3. joke - Joke\n4. shayari - Shayari\n5. owner - Owner\n6. salam - Salam\n7. ping - Test\n\nNawabshah wala bot 🚀`;
  }
  else if (cmd === 'time') {
    reply = `⏰ Nawabshah mein: ${new Date().toLocaleTimeString('en-PK', {timeZone: 'Asia/Karachi'})}`;
  }
  else if (cmd === 'date') {
    reply = `📅 Tareekh: ${new Date().toLocaleDateString('en-PK', {timeZone: 'Asia/Karachi'})}`;
  }
  else if (cmd === 'joke') {
    const jokes = [
      "Nawabshah ka banda bot bana le, Facebook khud confuse ho jaye 😂",
      "2 din webhook se ladai, phir bot paida hua 🔥"
    ];
    reply = jokes[Math.floor(Math.random() * jokes.length)];
  }
  else if (cmd === 'shayari') {
    reply = "Code likhte likhte raat ho gayi,\nWebhook ki setting mein jaan atki rahi";
  }
  else if (cmd === 'owner') {
    reply = "👑 Mera owner Nawabshah ka sher hai 🦁\n2 din mein Facebook ko hara diya";
  }
  else if (cmd === 'salam') {
    reply = "Walaikum Assalam! Michel bot hazir hai ❤️";
  }
  else if (cmd === 'ping') {
    reply = "Pong! 🏓 Main zinda hun bhai";
  }
  else {
    reply = `Aap ne kaha: "${text}"\n'help' likho commands ke liye 🚀`;
  }

  callSendAPI(sender_psid, reply);
}

function callSendAPI(sender_psid, response_text) {
  let request_body = {
    "recipient": { "id": sender_psid },
    "message": { "text": response_text }
  };

  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent!');
    } else {
      console.error("Error:" + err);
    }
  });
}

app.listen(PORT, () => console.log(`Webhook running on port ${PORT}`));
