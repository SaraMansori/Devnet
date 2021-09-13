const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new Schema({
  subject: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    match: /^\S+$/,
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
  
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  date: {
    type: Date,
    required: true,
    default: Date.now()
  }
},
  {
  timestamps: true
}
);

const Message = model("Message", messageSchema);

module.exports = Message;
