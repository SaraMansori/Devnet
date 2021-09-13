const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//TODAS LAS RUTAS - SEPARARLAS

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
