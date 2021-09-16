const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");


const articleSchema = new Schema({
  image:{
      type: String,
      required: true,
      default:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },

  title: {
    type: String,
    trim: true
  },

  headline: {
    type: String,
    trim: true
  },

  date: {
      type: Date,
  },

  author: {
    type: String
  },

  url: {
    type: String
  }
},
  {
  timestamps: true
}
);

const Article = model("Article", articleSchema);

module.exports = Article;
