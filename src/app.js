const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// Ein einfacher "Hallo Welt"-Endpunkt für den Anfang
app.get("/", (req, res) => {
  res.status(200).json({ message: "Willkommen bei der E-Commerce API!" });
});

app.use("/api", productRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
