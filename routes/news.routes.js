const router = require("express").Router();
const Article = require('../models/Article.model')
const axios = require("axios")
const User = require("../models/User.model")
const { getRandomImage, newsImages, formatDate, checkBookmark, isLoggedIn } = require("../utils");


router.get('/', (req, res, next) => {

    const { abstract } = req.params

    axios
      .get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=technology/${abstract}&api-key=kUdfVcYG0XptpQm8ZivAOZPBuaBitK8u`)
      .then(response => {
        
        const newsArray = response.data.response.docs
        const promisesArray = newsArray.map(response => {

          let image = response.multimedia[0]?.url ? `https://static01.nyt.com/${response.multimedia[0].url}` : getRandomImage(newsImages)
          const title = response.headline.main
          const headline = response.abstract
          const author = response.byline.original
          const date = response.pub_date
          const url =  response.web_url

          return Article.findOneAndUpdate({title},
            {image, title, headline, date, author, url} ,
            {upsert: true, new: true, setDefaultsOnInsert: true})
          })

        return Promise.all(promisesArray)

        })
      .then(allArticles => {
          allArticles.forEach((article) => {
            article.formattedDate = formatDate(new Date(article.date))
            isLoggedIn(req) ? article.isBookmark = checkBookmark(req.session.currentUser.articles, article.id) : null
          })
          res.render('news/news', {allArticles})
        })
      .catch(error => console.log(error))
  })

  router.get('/bookmark', (req, res) => {
    const { id } = req.query
    
    if (!isLoggedIn(req)) {
      res.redirect("/registro")
    }  else {

    User
      .findByIdAndUpdate(req.session.currentUser._id, {$push: {articles: id}}, {new: true})
      .then((user) => {
        console.log(user)
        req.session.currentUser = user
        
        res.redirect("/news")
      })
      .catch(error => console.log(error))

    }

  })

  router.get('/remove-bookmark', (req, res) => {

    const { id } = req.query


        User
          .findByIdAndUpdate(req.session.currentUser._id, {$pull: {articles: id}}, {new: true})
          .then((user) => {
            req.session.currentUser = user
            res.redirect("/news")
          })
          .catch(error => console.log(error))


  })
  
  
module.exports = router