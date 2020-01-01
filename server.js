const express = require("express");
const request = require("request");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const API_KEY = process.env.WEATHER_API_KEY;

app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals = { error: null, weather: null };
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: "" });
});

app.post("/", (req, res) => {
  let city = req.body.city;
  let country = req.body.country;
  let url = `http://api.openweathermap.org/data/2.5/weather/?q=${city},${country}&&appid=${API_KEY}&units=metric`;
  request(url, function(err, response, body) {
    if (err) {
      res.render("index", { error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);
      if (weather.main === undefined) {
        res.render("index", {
          weather: null,
          error: "Error! Please try again later"
        });
      } else {
        let weatherText = `It's ${weather.main.temp} degrees Celsius in ${weather.name}`;
        res.render("index", { weather: weatherText, error: null });
      }
    }
  });
});

app.listen(4000, function() {
  console.log("Example app listening on port 4000");
});
