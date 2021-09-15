require("dotenv/config");

require("./db");

const express = require("express");
const app = express();
require("./config")(app);
app.locals.title = `devnet`;


require('./config/session.config')(app)
require("./routes/index")(app)

require("./error-handling")(app);

module.exports = app;
