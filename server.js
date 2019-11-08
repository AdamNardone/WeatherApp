if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
const axios = require("axios");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/weather", (req, res) => {
  const url = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${req.body.latitude},${req.body.longitude}?units=auto`;
  axios({
    url: url,
    responseType: "json"
  }).then(data => res.json(data.data));
});

app.post("/location", (req, res) => {
  const url = `https://api.tomtom.com/search/2/geocode/${req.body.query}.JSON?key=${TOMTOM_API_KEY}&limit=1`;
  axios({
    url: url,
    responseType: "json"
  }).then(data => res.json(data.data.results));
});

app.listen(3000, () => {
  console.log("Server Started");
});
