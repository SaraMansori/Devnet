const router = require("express").Router()
const { isLoggedIn } = require('./../middleware')
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Comment = require("../models/Comment.model")
const {formatDate, formatTime} = require("../utils");



router.get('/profile/:id', isLoggedIn, (req, res) => {

    const id = req.session.currentUser._id

    const createdEvents = []
    const participatingEvents = []
    const userComments = []

    Event
        .find({owner: id})
        .populate("owner")
        .lean()
        .then((events) => {
            events.forEach((event) => createdEvents.push(event))
            return Event.find({participants:id}).populate("participants")
        })
        .then((events) => {
            events.forEach((event) => participatingEvents.push(event))
            return Comment.find({receiver:id}).populate("owner").lean()
        })
        .then((comments) => {
            comments.forEach((comment) => {
                comment.formattedDate = formatDate(comment.date)
                comment.time = formatTime(comment.date) 
                userComments.push(comment)
            })
            return User.findById(id).populate("followers").populate("following").populate("articles")
        })
        .then((user) => {
            res.render('user/profile', { user, createdEvents, participatingEvents, userComments })
        })

})

router.get("/follow", (req, res) => {

    const { id, view } = req.query
    const currentUser = req.session.currentUser._id

    User
        .findByIdAndUpdate(id, {$push: {followers: currentUser}})
        .populate("followers")
        .then(() => {
            return User.findByIdAndUpdate(currentUser, {$push: {following: id}})
        })
        .then(() => {

            if (view === "list") {
                res.redirect(`/community`)
            } else if (view === "details") {
                res.redirect(`/community/details?id=${id}`)
            }

        })
        .catch((err)=>console.log(err))
})

router.get("/unfollow", (req, res) => {

    const { id, view } = req.query
    const currentUser = req.session.currentUser._id

    User
        .findByIdAndUpdate(id, {$pull: {followers: currentUser}})
        .populate("following")
        .then(() => {
            return User.findByIdAndUpdate(currentUser, {$pull: {following: id}})
        })
        .then(() => {
            if (view === "list") {
                res.redirect(`/community`)
            } else if (view === "details") {
                res.redirect(`/community/details?id=${id}`)
            }
        })
        .catch((err)=>console.log(err))
})

router.post("/comment", (req, res) => {

    const {id, text} = req.body
    const owner = req.session.currentUser._id

    Comment
        .create({text, owner, receiver: id, date: Date.now()})
        .then((comment) => {
            res.redirect(`/community/details?id=${id}`)
    })
    
})

module.exports = router