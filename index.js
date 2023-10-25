const line = require("@line/bot-sdk");
const axios = require("axios").default;
const dotenv = require("dotenv");
const express = require("express");
var JSSoup = require("jssoup").default;
const app = express();

// const port = process.env.PORT || 3000;
const port = 4000;

// include flex_msg.js
const { get_msg } = require("./flex_msg");
const { google_map } = require("./google_map");


const env = dotenv.config().parsed;
const config = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};
const client = new line.Client(config);

app.post("/webhook", line.middleware(config), (req, res) => {
  try {
    const events = req.body.events;
    return events.length > 0
      ? Promise.all(events.map(handleEvent))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

const handleEvent = (event) => {
  // repyr msg back
  if (event.type === "message" && event.message.type === "text") {
    google_map()
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  }

  // //unsend event
  // if(event.type === 'unsend'){
  //     return client.pushMessage(event.source.userId, {
  //         "type": "text",
  //         "text": "มีคนยกเลิกข้อความ",
  //     });
  // }
  // get line account info
  if (event.type === "unsend") {
    return client.getProfile(event.source.userId).then((profile) => {
      return client.pushMessage(event.source.userId, {
        type: "text",
        text: `คุณ ${profile.displayName} ยกเลิกข้อความ`,
      });
    });
  }

  // send msg to userId
};

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
