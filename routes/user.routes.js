const router = require("express").Router()
const { isLoggedIn } = require('./../middleware')
const User = require("../models/User.model")


router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.session.currentUser })
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

module.exports = router