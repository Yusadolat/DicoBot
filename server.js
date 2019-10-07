var express = require("express");
var app = express();
var request = require("request");
require("dotenv").config();
var _ = require("lodash");
const bodyParser = require("body-parser");

const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.post("/incoming", (req, res) => {
  const twiml = new MessagingResponse();
  console.log(req.body);
  if (
    req.body.Body.toLowerCase().trim() != "hi" &&
    req.body.Body.toLowerCase().trim() != "hello" &&
    req.body.Body.toLowerCase().trim() != "test" &&
    req.body.Body.toLowerCase().trim() != "help"
  ) {
    request(
      "https://od-api.oxforddictionaries.com:443/api/v1/entries/en/" +
        req.body.Body,
      {
        headers: {
          app_id: process.env.APPID,
          app_key: process.env.APPKEY
        }
      },
      function(error, response, body) {
        body = JSON.parse(body.trim());
        console.log("body:", body);

        var msg = twiml.message(`*${body.results[0].id}*

*Part of Speech:* ${body.results[0].lexicalEntries[0].lexicalCategory}

*Definition:* ${
          body.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
        }

 *Example:* ${
   body.results[0].lexicalEntries[0].entries[0].senses[0].examples[0].text
 }

 *Pronunciation:* ${
   body.results[0].lexicalEntries[0].pronunciations[0].phoneticSpelling
 }  `);
        res.writeHead(200, {
          "Content-Type": "text/xml"
        });
        res.end(twiml.toString());
      }
    );
  } else {
    var msg = twiml.message(`Hey 👋

I am your Whatsapp Word Assistant (WWA) -a wordtastic bot which helps you with the meaning of any word, right within Whatsapp.

Try it out - send me a word you want to know its meaning.
😉

Sponsored by Pronto Afrika(c) 2019.  Developed by Yusadolat`);
    res.writeHead(200, {
      "Content-Type": "text/xml"
    });
    res.end(twiml.toString());
  }
});

app.post("/check", function(req, res) {
  console.log(req.body.Body);
});
app.get("*", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

var listener = app.listen(process.env.PORT || 3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
