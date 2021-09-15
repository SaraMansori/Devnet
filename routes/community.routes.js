const router = require("express").Router();
const axios = require("axios");
const { Model } = require("mongoose");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const mongoose = require('mongoose');
const {checkFollower } = require("../utils");

router.get("/", (req, res) => {

    User
        .find()
        .lean()
        .then((users) => {
            users.forEach((user) => {
                user.isFollower = checkFollower(user.followers, req.session.currentUser._id)
            })
            res.render("community/list", {users})
        })
        .catch(err => console.log(err))
})

router.get("/details", (req, res) => {
    const { id } = req.query
    let user = {}
    let createdEvents = []

    User
        .findById(id)
        .populate("followers")
        .populate("following")
        .then((currentUser) => {
            user = currentUser
            userFollowers = currentUser.followers.map((user) => user._id)

            user.isFollower = checkFollower(userFollowers, req.session.currentUser._id)
            return Event.find({owner: id})
        })
        .then((events) => {
            events.forEach((event) => createdEvents.push(event))
            return Event.find({participants:id}) 
        })
        .then((participatingEvents) => {
            res.render("community/details", {user, createdEvents, participatingEvents})
        })
        .catch(err => console.log(err))


})

module.exports = router;