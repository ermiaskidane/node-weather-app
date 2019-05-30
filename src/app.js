const path = require("path");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const express = require("express");
const hbs = require("hbs");

// console.log(__dirname);
// console.log(__filename);

const app = express();
const port = process.env.PORT || 3000;

// express.use for costumize the server
// Define path for express config To customize views directory
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handleBars engine and views location and tell express which template engine we install
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Ermias Kidane"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About page",
    image: "/img/e.jpg"
  });
});

app.get("/about/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Ermias",
    errorMessage: "about article not found"
  });
});

// app.get("/weather", (req, res) => {
//   res.render("weather", {
//     title: "forecast",
//     percipitation: "0%",
//     location: "leicester"
//   });
// });

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "you must provide address "
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error: error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error: error });
        }
        res.send({
          forecast: forecastData,
          location: location,
          address: req.query.address
        });
      });
    }
  );
  // if (!req.query.place) {
  //   return res.send({
  //     error: "you must provide place"
  //   });
  // }

  // res.send({
  //   forecast: "it is snowing",
  //   location: "leicester",
  //   address: req.query.address
  // });
});

app.get("/product", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "you must provide a search term"
    });
  }
  console.log(req.query);
  res.send({
    products: [req.query.search]
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Ermias",
    errorMessage: "Page not found"
  });
});

// app.get("/help", (req, res) => {
//   res.render("help");
// });
// app.get("", (req, res) => {
//   res.send([{ name: "jossi" }, { name: "lucy" }]);
// });

// app.get("/help", (req, res) => {
//   res.send({
//     name: "Ermias",
//     age: "25"
//   });
// });

// app.get("/about", (req, res) => {
//   res.send("<h1> About page </h1>");
// });

// app.get("/weather", (req, res) => {
//   res.send({
//     percipitation: "0%",
//     location: "leicester"
//   });
// });
// app.listen(3000, () => {
//   console.log("server is up on port 3000");
// });

app.listen(port, () => {
  console.log("server is up on port " + port);
});
