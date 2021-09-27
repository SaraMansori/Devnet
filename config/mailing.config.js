
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'devnethubsocial@gmail.com',
        pass: 'devnethubsocial1-'
    }

//     service: 'Gmail',
//     auth: {
//         user: 'devnethubsocial@gmail.com',
//         pass: 'devnethubsocial1-'
//     }
})

module.exports = transporter