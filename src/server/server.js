const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());
const PORT = 8080;

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});
