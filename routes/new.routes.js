const router = require("express").Router();
const Article = require('./../models/Article.model')
const axios = require("axios")

router.get('/', (req, res, next) => {

    const { abstract } = req.params
  
    axios
      .get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=technology/${abstract}&api-key=kUdfVcYG0XptpQm8ZivAOZPBuaBitK8u`)
      .then(response => {
  
        Article
          .create()

        res.render('./../views/news/news', { docs: response.data.response.docs })
  
      })
      .catch(error => console.log(error))
  
  })
  
module.exports = router