const router = require("express").Router()
const User = require("../models/User.model");

router.get('/profile/:id', (req, res, next ) =>{

    const {id} = req.params
    
    
    User
    .findById(id)
    .then((user) =>res.render('./../views/profiles/views',user))
    .catch(err => console.log(err))

})

module.exports = router