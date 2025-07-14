const express = require("express");
const app = express();
//const bodyParser = require('body-parser');

// Ein einfacher "Hallo Welt"-Endpunkt für den Anfang
app.get("/", (req, res) => {
  res.status(200).json({ message: "Willkommen bei der E-Commerce API!" });
});

module.exports = app;
