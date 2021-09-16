
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'devnethubsocial@gmail.com', //req.current.user
        pass: 'devnethubsocial1-'
    }
})

module.exports = transporter