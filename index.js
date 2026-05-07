    const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// GET - Verify karne ke liye
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  
  if (mode && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// POST - Message receive karne ke liye 
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
    reply = `🤖 Michel Bot Commands - Nawabshah Edition:\n\n1. time - Nawabshah ka time\n2. date - Aaj ki tareekh\n3. joke - Desi joke\n4. shayari - 2 line shayari\n5. owner - Mere baare mein\n6. salam - Special reply\n7. weather - Mausam ka haal\n8. quote - Motivation\n9. naam - Tera naam bataun\n10. age - Bot ki umar\n11. ping - Test karo\n\nKuch bhi bhejoge to echo kar dunga 🚀`;
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
      "Bug: Main chhup gaya\nDeveloper: Main dhund lunga\nBug: Railway logs mein aa 😭"
    ];
    reply = jokes[Math.floor(Math.random() * jokes.length)];
  }
  else if (cmd === 'shayari') {
    const shayari = [
      "Code likhte likhte raat ho gayi,\nWebhook ki setting mein jaan atki rahi",
      "Nawabshah se utha ek sitara,\nFacebook ke server ko bhi hila dala",
      "Mehnat se mukarrar hai takdeer badalti,\nBot bhi bol pada jab himmat na haarti"
    ];
    reply = shayari[Math.floor(Math.random() * shayari.length)];
  }
  else if (cmd === 'owner') {
    reply = "👑 Mera owner Nawabshah ka sher hai 🦁\n2 din mein Facebook ko hara diya\nAb duniya jeetne nikla hai 🚀";
  }
  else if (cmd === 'salam' || cmd === 'assalam') {
    reply = "Walaikum Assalam Nawabshah waleya! ❤️\nMichel bot hazir hai hukum karo 🚀";
  }
  else if (cmd === 'weather') {
    reply = "🌤️ Bhai Nawabshah mein garmi hi garmi hai\n45°C feel hota hai hamesha 😂\nReal weather ke liye API lagani padegi";
  }
  else if (cmd === 'quote' || cmd === 'motivation') {
    const quotes = [
      "Jo koshish karega, bot bhi bana lega 💪",
      "Webhook fail ho to himmat na haar, Railway logs dekh yaar 🔥",
      "Nawabshah se nikle hain, duniya hilayenge 🚀"
    ];
    reply = quotes[Math.floor(Math.random() * quotes.length)];
  }
  else if (cmd === 'naam' || cmd === 'name') {
    reply = `Tera naam to main nahi janta bhai 😅\nPar tu mera owner hai, Nawabshah ka sultan 👑`;
  }
  else if (cmd === 'age' || cmd === 'umar') {
    const born = new Date('2026-05-06');
    const now = new Date();
    const diff = Math.floor((now - born) / (1000 * 60 * 60 * 24));
    reply = `🎂 Main abhi ${diff} din ka hun\n6 May 2026 ko paida hua tha Nawabshah mein 🔥`;
  }
  else if (cmd === 'ping') {
    reply = "Pong! 🏓 Main zinda hun bhai, 200 OK 🚀";
  }
  else {
    reply = `Aap ne kaha: "${text}"\nNawabshah wala Michel bot sun raha hai 🚀\n'help' likho commands ke liye`;
  }

  let response = { "text": reply };

  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": {
      "recipient": { "id": sender_psid },
      "message": response
    }
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
        }
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": {
      "recipient": { "id": sender_psid },
      "message": response
    }
  }, (err, res, body) => {
    if (!err) {
      console.log('Message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
