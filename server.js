require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const paymentRoutes = require("./routes/payment");
const callbackRoutes = require("./routes/callback");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/payment", paymentRoutes);
app.use("/callback", callbackRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});