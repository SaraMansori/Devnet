const router = require("express").Router()
const { isLoggedIn } = require('./../middleware')
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Comment = require("../models/Comment.model")


router.get('/profile', isLoggedIn, (req, res) => {

    const id = req.session.currentUser._id

    let createdEvents = []
    let participatingEvents = []

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
            return User.findById(id)
        })
        .then((user) => {
            console.log("useeeeeeeeeeeer", user, "followeers", user.followers, "followiiing", user.following)
            res.render('user/profile', { user, createdEvents, participatingEvents })
        })

})

router.get("/follow", (req, res) => {

    const { id, view } = req.query
    const currentUser = req.session.currentUser._id

    User
        .findByIdAndUpdate(id, {$push: {followers: currentUser}})
        .populate("followers")
        .then(() => {
            if (view === "list") {
                res.redirect(`/community`)
            } else if(view === "details") {
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
        .then((user) => {
             if (view === "list") {
                res.redirect(`/community`)
            } else if(view === "details") {
                res.redirect(`/community/details?id=${id}`)
            }
        })
        .catch((err)=>console.log(err))
})

router.post("/comment", (req, res) => {

    const {id, text} = req.body
    const owner = req.session.currentUser._id

    console.log(owner)

    Comment
        .create({text, owner, receiver: id, date: Date.now()})
        .then((comment) => {
            console.log("----------------", comment)
            res.redirect(`/community/details?id=${id})`)
    })
    
})

module.exports = router