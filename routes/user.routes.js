
const router = require("express").Router()
const bcrypt = require('bcrypt')
const User = require("../models/User.model")


// Signup
router.get('/registro', (req, res) => res.render('auth/signup'))
router.post('/registro', (req, res) => {

    const { username, userPwd } = req.body

    if (userPwd.length === 0) {       // Si la contraseña está vacía
        res.render('auth/signup', { errorMsg: 'The password is required' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (user) {                   // Si el nombre de usuario ya existe
                res.render('auth/signup', { errorMsg: 'Registered user' })
                return
            }

            const bcryptSalt = 10
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(userPwd, salt)     // Contraseña hasheada

            User
                .create({ username, password: hashPass })         // <== !!!
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
})



// Login
router.get('/iniciar-sesion', (req, res) => res.render('auth/login'))
router.post('/iniciar-sesion', (req, res) => {

    const { email, userPwd } = req.body

    if (userPwd.length === 0 || email.length === 0) {
        res.render('auth/login', { errorMsg: 'Rellena los campos' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMsg: 'Unrecognised user' })
                return
            }

            if (bcrypt.compareSync(email, user.password) === false) {
                res.render('auth/login', { errorMsg: 'Incorrect password' })
                return
            }

            req.session.currentUser = user
            res.redirect('/perfil')
        })
        .catch(err => console.log(err))

})


// Logout
router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router