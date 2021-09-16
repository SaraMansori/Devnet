const router = require("express").Router()
const bcrypt = require('bcrypt')
const User = require("../models/User.model")
const CDNupload = require("../config/upload.config");



// Signup
router.get('/signup', (req, res) => res.render('auth/signup'))
router.post('/signup', (req, res) => {


    const { username, userPwd } = req.body 

    if (userPwd.length === 0 || username.length === 0) {       
        res.render('auth/signup', { errorMsg: 'Password is mandatory' })
        return
    }

    User
        .findOne({ username })
        .then( user => {

            if (user) {                   
                res.render('auth/signup', { errorMsg: 'Already registered user' })
                return
            }

            const bcryptSalt = 10
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(userPwd, salt)     

            User
                .create({ username, password: hashPass })        
                .then((user) => res.redirect(`/signup/info/${user.id}`))
                .catch(err => console.log(err))
    
        

        })
        .catch(err => console.log(err))
})

router.get("/signup/info/:id", (req, res) => {

    const id = req.params
    res.render('./../views/form', id)

})

router.post('/signup/info/:id', CDNupload.single("image"), (req, res,) => {

    const {id} = req.params
    const { email, description, profession } = req.body

    User
        .findById(id)
        .then((user) => {
            req.session.currentUser = user
            req.app.locals.userLogged = true
            return User.findByIdAndUpdate(id, {email, description, profession, image: req.file?.path}, { new: true })
        })
        .then(()=> res.redirect(`/user/profile`)) 
        .catch(err => console.log(err))
})


// Login
router.get('/login', (req, res) => res.render('auth/login'))
router.post('/login', (req, res) => {

    const { username, userPwd } = req.body

    if (userPwd.length === 0 || username.length === 0) {
        res.render('auth/login', { errorMsg: 'Fill in the fields' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMsg: 'User not recognised' })
                return
            }

            if (bcrypt.compareSync(userPwd, user.password) === false) {
                res.render('auth/login', { errorMsg: 'Incorrect password' })
                return
            }

            req.session.currentUser = user
            req.app.locals.userLogged = true
            res.redirect('/user/profile')
        })
        .catch(err => console.log(err))

})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
    req.app.locals.userLogged = false
})


module.exports = router