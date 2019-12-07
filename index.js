const express = require('express')
const bodyParser = require('body-parser')
const usersRepo = require('./repositories/users')

const app = express()

// use bodyParser() if you want the form data to be 
// available in req.body.
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign Up</button>
            </form>
        </div>
    `)
})

app.post('/', async (req, res) => {
    const {
        email,
        password,
        passwordConfirmation
    } = req.body

    const existingUser = await usersRepo.getOneBy({
        email: email
    })
    if (existingUser) {
        return res.send('Email in use')
    }
    if (password !== passwordConfirmation) {
        return res.send('Passwords must match')
    }

    // Create a user in our user repo to represent this person
    
    // Store the id of that user inside of the users cookie

    res.send('Account Created!')
})

app.listen(3000, () => {
    console.log('Listening')
})