const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')

const app = express()
// Middlewares
app.use(express.static('public'))
// use bodyParser() if you want the form data to be 
// available in req.body.
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieSession({
    // encrypts information stored inside of cookie
    keys: ['sd12asdsal1asdaczz1213']
}))
app.use(authRouter)

app.listen(3000, () => {
    console.log('Listening')
})