const router = require("express").Router();
const axios = require("axios");
const { Model } = require("mongoose");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const { formatDate, formatTime, capitalize, checkOwner, checkParticipant } = require("../utils");

