var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./routes/home.js")(app);
require("./routes/list.js")(app);
require("./scripts/scrape.js")(app);

app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});
