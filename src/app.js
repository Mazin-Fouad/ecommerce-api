const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");

// Ein einfacher "Hallo Welt"-Endpunkt für den Anfang
app.get("/", (req, res) => {
  res.status(200).json({ message: "Willkommen bei der E-Commerce API!" });
});

app.use("/api", productRoutes);

module.exports = app;
