const router = require("express").Router()
const bcrypt = require('bcrypt')
const User = require("../models/User.model")


// Signup
router.get('/registro', (req, res) => res.render('auth/signup'))
router.post('/registro', (req, res) => {

    const { username, userPwd } = req.body 

    if (userPwd.length === 0) {       
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
                .then((user) => res.redirect(`/registro/info/${user.id}`))
                .catch(err => console.log(err))
    
        

        })
        .catch(err => console.log(err))
})

router.get("/registro/info/:id", (req, res) => {
    res.render('./../views/form')


})

router.post('/registro/info/:id',(req, res,) => {


    const {id} = req.params
    const { email, description, profession } = req.body

    User
    .findByIdAndUpdate(id, {email, description, profession}, { new: true })
    .then(()=> res.redirect(`/profile/${id}`)) 
    .catch(err => console.log(err))
})


// Login
router.get('/iniciar-sesion', (req, res) => res.render('auth/login'))
router.post('/iniciar-sesion', (req, res) => {

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
            res.redirect(`/profile/${user.id}`)
        })
        .catch(err => console.log(err))

})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router