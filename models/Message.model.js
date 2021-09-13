const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new Schema({
  subject: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    match: /^\s+$/,
    trim: true
  },
  text:{
    type: String,
    required: true,
    maxlength: 300,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  //owner es el que tiene el mensaje de entrada en su bandeja
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
},
  {
  timestamps: true
}
);

const Message = model("Message", messageSchema);

module.exports = Message;
