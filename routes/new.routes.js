const router = require("express").Router();
const Article = require('./../models/Article.model')
const axios = require("axios")

router.get('/', (req, res, next) => {

    const { abstract } = req.params

    const imgArr = [
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1352&q=80',
      "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
      'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTV8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTZ8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjN8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3liZXJzZWN1cml0eXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1611175697352-c8a3d5719783?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGN5YmVyc2VjdXJpdHl8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ]

    const randomImg = (arr) => arr[Math.round(Math.random() * (arr.length-1))]
  
    axios
      .get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=technology/${abstract}&api-key=kUdfVcYG0XptpQm8ZivAOZPBuaBitK8u`)
      .then(response => {
        
        const newsArray = response.data.response.docs

        const promisesArray = newsArray.map(response => {

          let image = ""
          response.multimedia[0]?.url ? image = `https://static01.nyt.com/${response.multimedia[0].url}` : image = randomImg(imgArr)
          const title = response.headline.main
          const headline = response.abstract
          const author = response.byline.original
          const date = response.pub_date

          return Article.create({image, title, headline, date, author})
          
          })
          
          Promise.all(promisesArray)
            .then(allArticles => {
            console.log(allArticles)
            res.render('news/news', {allArticles})
          })

        })
        .catch(error => console.log(error))
  
  })
  
module.exports = router