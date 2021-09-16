const mongoose = require("mongoose")

module.exports = {
    isLoggedIn: (req, res, next) => {
        req.session.currentUser ? next() : res.render('auth/login', { errorMsg: 'Login to continue' })
    },
    checkId: (req, res, next) => {
        mongoose.Types.ObjectId.isValid(req.params.id) ? next() : res.redirect('/')
    },
    checkRoles: (...roles) => (req, res, next) => {
        roles.includes(req.session.currentUser.role) ? next() : res.render('auth/login', { errorMsg: 'You do not have permissions' })
    }
}