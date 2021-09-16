const router = require("express").Router()
const Event = require('../models/Event.model')
const User = require('../models/Event.model')

router.get('/events', (req, res) => {

    Event
        .find()
        .then(events => res.json(events))
        .catch(err => console.log(err))

})

router.get('/users', (req, res) => {

    User
        .find()
        .then(users => res.json(users))
        .catch(err => console.log(err))

})

module.exports = router