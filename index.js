const line = require('@line/bot-sdk');
const axios = require('axios').default;
const dotenv = require('dotenv');
const express = require('express');
const app = express();
// const port = process.env.PORT || 3000;
const port = 4000;

const env = dotenv.config().parsed;
const config = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
};
const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
    try{
       const events = req.body.events;
       return events.length > 0 ? Promise.all(events.map(handleEvent)) : res.status(200).send("OK");
    }
    catch(error){
       res.status(500).end();
    }
});

const handleEvent = (event) => {
    console.log(event)
    // repyr msg back
    if(event.type === 'message' && event.message.type === 'text'){
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: event.message.text
        });
    }
}

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

