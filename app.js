require("dotenv/config")

require("./db");

const express = require("express")
const app = express()
require("./config")(app)
app.locals.title = `devnet`
app.locals.mapsKey = process.env.MAPS_KEY
// app.locals.id = req.current.user

require('./config/session.config')(app)
require("./routes/index")(app)

require("./error-handling")(app)

module.exports = app
