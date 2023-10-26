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
// const { google_map } = require("./google_map");
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

async function google_map(keyword_search) {
  return new Promise(function (resolve, reject) {
    const key = "AIzaSyDfbDDI9ReFb1Yi1u6UMMImwYk4aHCDlFc";
    const googleMapsClient = require("@google/maps").createClient({
      key: key, // Replace with your Google Maps API Key
    });
    const keyword = keyword_search;
    const locationBias = "Thailand";
    let data = [];
    googleMapsClient.places(
      {
        query: keyword,
        location: locationBias,
      },
      (error, response) => {
        if (!error) {
          if (response.json.results.length > 0) {
            // foreach result
            response.json.results.forEach((element) => {
              const place = element;
              console.log("🚀 ~ file: index.js:52 ~ response.json.results.forEach ~ place:", JSON.stringify(place))
              // console.log({
              //   name: place.name,
              //   address: place.formatted_address,
              //   location: place.geometry.location,
              //   latitude: place.geometry.location.lat,
              //   longitude: place.geometry.location.lng,
              //   photo: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${key}`,
              //   mapsURL: `https://www.google.com/maps?q=${place.name}&ll=${place.geometry.location.lat},${place.geometry.location.lng}`,
              // })
              // console.log("+++++++++++++++")
              data.push({
                name: place.name,
                address: place.formatted_address,
                location: place.geometry.location,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                photo: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${key}`,
                mapsURL: `https://www.google.com/maps?q=${place.name}&ll=${place.geometry.location.lat},${place.geometry.location.lng}`,
              });
            });
            // console.log(data)
            // console.log("Resolve", data)
            resolve(data);
          } else {
            console.log("No results found for the given keyword in Thailand.");
          }
        } else {
          console.error("Error:", error);
        }
      }
    );
  });
}

const handleEvent = async (event) => {
  // repyr msg back
  if (event.type === "message" && event.message.type === "text") {
    // let flex_msg = get_msg();
    // console.log("1")
    // console.log(event.message.text);
    var res = await google_map(event.message.text);
    // console.log("🚀 ~ file: index.js:88 ~ handleEvent ~ res:", JSON.stringify(res));

    var name = res[0].name;
    var address = res[0].address;
    var location = res[0].location;
   
    var photo = res[0].photo;
    var mapsURL = res[0].mapsURL;
    // console.log("🚀 ~ file: index.js:1 ~ handleEvent ~ res", JSON.stringify(res));
    // google_map()
    // console.log("🚀 ~ file: index.js:111 ~ handleEvent ~ name, address, location, photo, mapsURL:", name, address, location, photo, mapsURL)
    var flex_msg = await get_msg(name, address, location, photo, mapsURL);
    // console.log("🚀 ~ file: index.js:110 ~ handleEvent ~ flex_msg:", flex_msg)

    return client.replyMessage(event.replyToken, {
      type: "flex",
      altText: "This is a Flex Message",
      contents: flex_msg,
    });
   
    // return client.replyMessage(event.replyToken, {
    //   type: "text",
    //   text: await get_msg(name, address, location, photo, mapsURL),
    // });
  }

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
