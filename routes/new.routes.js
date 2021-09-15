const router = require("express").Router();
const Article = require('./../models/Article.model')
const axios = require("axios")
const { getRandomImage, newsImages } = require("../utils");


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

          return Article.create({image, title, headline, date, author})
          })
          
        return Promise.all(promisesArray)
        })
      .then(allArticles => {
          res.render('news/news', {allArticles})
        })
      .catch(error => console.log(error))
  })
  
module.exports = router