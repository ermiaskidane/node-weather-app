const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "https://api.darksky.net/forecast/2226a874bde0e9d02a971f6f8d27f81d/" +
    latitude +
    "," +
    longitude;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("unable to connect to network", undefined);
    } else if (response.body.error) {
      callback("invalid location", undefined);
    } else {
      callback(
        undefined,
        response.body.currently.summary +
          " " +
          " the temperature is " +
          response.body.currently.temperature +
          " fehranheit in timezone " +
          response.body.timezone +
          "." +
          " minimam tempreture is " +
          response.body.daily.data[0].temperatureMin +
          " and maximam tempreture  is " +
          response.body.daily.data[0].temperatureMax
      );
    }
  });
};

module.exports = forecast;
