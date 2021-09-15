require("dotenv/config");
require("./db");


const express = require("express");
const app = express();
require("./config")(app);
require('./config/session.config')(app)
app.locals.title = `devnet`;


require("./routes/index")(app)
const hbs = require("hbs");

require("./error-handling")(app);

module.exports = app;
