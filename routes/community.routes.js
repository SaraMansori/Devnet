const router = require("express").Router();
const axios = require("axios");
const { Model } = require("mongoose");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const mongoose = require('mongoose');
const {checkFollower, formatDate, formatTime, loggedIn} = require("../utils");
const { checkId, isLoggedIn, checkRoles } = require("../middleware")

router.get("/", (req, res) => {
    
    let logged = loggedIn(req)

    User
        .find({_id: {$ne: req.session.currentUser?._id}})
        .lean()
        .then((users) => {
            users.forEach((user) => {
                user.isFollower = checkFollower(user.followers, req.session.currentUser?._id)
            })
            res.render("community/list", {users, logged})
        })
        .catch(err => console.log(err))
})

router.get("/details", isLoggedIn, (req, res) => {
    const { id } = req.query
    let user = {}
    const createdEvents = []
    const participatingEvents = []
    const userComments = []

    User
        .findById(id)
        .populate("followers")
        .populate("following")
        .then((currentUser) => {
            user = currentUser
            userFollowers = currentUser.followers.map((user) => user._id)

            user.isFollower = checkFollower(userFollowers, req.session.currentUser._id)
            return Event.find({ owner: id })
        })
        .then((events) => {
            events.forEach((event) => createdEvents.push(event))
            return Event.find({ participants: id })
        })
        .then((events) => {
            events.forEach((event) => participatingEvents.push(event))
            return Comment.find({ receiver: id }).populate("owner").lean()
        })
        .then((comments) => {
            comments.forEach((comment) => {
                comment.formattedDate = formatDate(comment.date)
                comment.time = formatTime(comment.date)
                userComments.push(comment)
            })
            res.render("community/details", { user, createdEvents, participatingEvents, userComments })
        })
        .catch(err => console.log(err))


})

module.exports = router;