require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const waitListRoute = require("./routes/waitlist.route");
const serverless = require("serverless-http");



app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://streamjump.info"],
    credentials: true,
  })
);
// routes
app.use("/api", waitListRoute);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is now running");
});
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    // '0.0.0.0' makes it listen on all network interfaces
    console.log(`Server running on port ${PORT}`);
  });
  console.log("connected to DB");
});
module.exports.handler = serverless(app);
