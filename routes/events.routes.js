const router = require("express").Router();

router.get('/events', (req, res, next) => {
    res.render('./../views/events/event.hbs')
  })  

module.exports = router;