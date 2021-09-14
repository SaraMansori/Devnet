
module.exports = app => {

  app.use("/", require("./base.routes"))
  app.use("/events", require("./events.routes"))
  app.use("/news", require("./new.routes"))
  app.use("/user", require("./user.routes"))
  app.use("/", require("./auth.routes"))
  //app.use("/community", require("./community.routes"))
  //app.use("/", require("./auth.routes"))

}
