const router = require("express").Router();

router.get('/login', (req, res , next) =>{
    res.render('./../auth/login.hbs')
  })
    

module.exports = router;