const express = require("express");
const app = express();
const port = process.env.port || 5000;

app.get("/", (req, res) => {
  res.send("HThis is digital tech server side ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});