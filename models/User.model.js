const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");
const Schema = mongoose.Schema;


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
    required: true,
    minlength: 0,
    maxlength: 100,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    default: 'https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg'
  },

  joined_events: [{
    type: Schema.Types.ObjectId,
    ref: 'Events'
  }],

  created_events: [{
    type: Schema.Types.ObjectId,
    ref: 'Events'
  }],

  profession:[{
    type: String,
    required: true,
    default: 'UNKNOWN',
    enum:['WEB DEVELOPER', 'DATA ANALYTICS', 'DESIGN UX/UI', 'CIBERSECURITY','DEVOPS', 'MOBILE DEVELOPER','DESKTOP DEVELOPER',]
  }],

  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  
  community: [{

    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],

    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]

  }],

  articles: [{
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
