const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");



const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    trim: true
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
  },
},
  {
  timestamps: true
}
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
