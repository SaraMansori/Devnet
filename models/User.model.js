const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 15,
    match: /^\S+$/,
    trim: true
  },
  role:{
    type: String,
    enum: ['ADMIN', 'GUEST', 'USER'],
    default: 'USER',
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 100,
    trim: true,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
    default: 'https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg'
  },
  //'joined-events': [{
  //  type: Schema.Types.ObjectId,
  //  ref: 'Events'
  //}],
  //'created-events': [{
  //  type: Schema.Types.ObjectId,
  //  ref: 'Events'
  //}],
  profession:[{
    type: String,
    default: 'UNKOWN',
    enum:['WEB DEVELOPER', 'DATA ANALYTICS', 'DESIGN UX/UI', 'CIBERSECURITY','DEVOPS', 'MOBILE DEVELOPER','DESKTOP DEVELOPER',]
  }],
  /* comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }], */
  'followers': [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  'following': [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  'articles': [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }]
},{
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;
