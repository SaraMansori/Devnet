const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/events', (req, res, next) => {
  res.render('./../views/events/event.hbs')
})


router.get('/login', (req, res , next) =>{
  res.render('./../auth/login.hbs')
})

module.exports = router;
