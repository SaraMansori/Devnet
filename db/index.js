
const mongoose = require("mongoose");


const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/devnet";

mongoose
  .connect(process.env.DB_REMOTE)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
