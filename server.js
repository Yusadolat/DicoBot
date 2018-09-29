var express = require('express');
var app = express();
var request = require('request');
var _ = require('lodash');
const bodyParser = require('body-parser');


const accountSid = process.env.SID || 'AC2bb4ef8d22682ed2d77b33347f318806';
const authToken = process.env.SID || '93fca4aaff9c5c489a5d928a6a7f4b10';
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
//.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/incoming', (req, res) => {
  const twiml = new MessagingResponse();
  console.log(req.body)
  if(req.body.Body.toLowerCase().trim()!="hi" && req.body.Body.toLowerCase().trim()!="hello" && req.body.Body.toLowerCase().trim()!="test" && req.body.Body.toLowerCase().trim()!="help"){
  request('https://googledictionaryapi.eu-gb.mybluemix.net/?define='+req.body.Body, function (error, response, body) {
    body = JSON.parse(body.trim())
    console.log('body:', body["word"]);
    var example;
    var define;
    if(_.has(body, 'meaning.adjective') === true){
      define = body["meaning"]["adjective"][0]["definition"]
      example = body["meaning"]["adjective"][0]["example"] 
	  }else if(_.has(body, 'meaning.noun') === true) {
    
    define = body["meaning"]["noun"][0]["definition"]
    example = body["meaning"]["noun"][0]["example"]


    } else if(_.has(body, 'meaning.verb') === true) {
    define = body["meaning"]["verb"][0]["definition"]
    example = body["meaning"]["verb"][0]["example"]


    }else{
    console.log("yyy");
    }
    
    // define start here
//     var example;
    
    
    var msg = twiml.message(`*${body["word"]}*

*Definition:* ${define}
  
 *Example:*  ${example}`);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  });
  }
  else{
    var msg = twiml.message(`Hey 👋

I am your Whatsapp Word Assistant (WWA) -a wordtastic bot which helps you with the meaning of any word, right within Whatsapp.

Try it out - send me a vocabulary you want to know its meaning.
😉

Sponsored by Pronto Afrika (c) 2018.  Developed by Yusadolat
www.pronto.com.ng Leading Web/App Development Agency.`)
    res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  }
  
});

app.post('/check', function(req, res) {
  console.log(req.body.Body)
});
app.get('*', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


var listener = app.listen(process.env.PORT  || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

