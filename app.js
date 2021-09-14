// require("dotenv/config");
require("./db");


const express = require("express");
const app = express();
require("./config")(app);
require('./config/session.config')(app)

const hbs = require("hbs");
app.locals.title = ``;

require('./routes')(app)
require("./error-handling")(app);

module.exports = app;
