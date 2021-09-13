const { urlencoded } = require("express");
const { Schema, model } = require("mongoose");
const Schema = mongoose.Schema;


const eventSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    maxlength: 15,
    match:/^\S+$/,
    trim: true
  },

  short_description:{
    type: String,
    match:/^\S+$/,
    maxlength: 15,
  },

  description:{
    type: String,
    maxlength: 400,
  },

  date: {
    type: Date,
    required: true,
  },

  location: {
        type: {
            type: String,
        },
        coordinates: [Number]
    },

  location_info: {
    city: {
      type: String,
    },

    street: {
      type: String,
    }
  },

  image: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80'
  },
  
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
 },
 
 {
  timestamps: true
  }
);

eventSchema.index({ location: '2dsphere'})

const Event = model("Event", eventSchema);

module.exports = Event;