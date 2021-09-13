const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("index");
});


router.get('/events', (req, res, next) => {
  res.render('./../views/events/event')
})


router.get('/login', (req, res , next) =>{
  res.render('./../auth/login')
})

router.get('/news', (req, res, next) =>{
  res.render('./../views/news/news')
})

router.get('/joinus', (req, res, next) =>{
  res.render('./../auth/signup')
})

module.exports = router;
