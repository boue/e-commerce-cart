const express = require('express')
const {
    check,
    validationResult
} = require('express-validator')
const usersRepo = require('../../repositories/users')
const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')

// subrouter, same as app router, but separate and export it
const router = express.Router()

router.get('/signup', (req, res) => {
    res.send(signupTemplate({
        req: req
    }))
})

router.post('/signup',
    [
        check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email').custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({
                email: email
            })
            if (existingUser) {
                throw new Error('Email is in use')
            }
        }),
        check('password').trim().isLength({
            min: 4,
            max: 20
        }),
        check('passwordConfirmation').trim().isLength({
            min: 4,
            max: 20
        }).withMessage('Must be abetween 4 and 20 characters').custom((passwordConfirmation, {
            req
        }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match')
            }
        })
    ], async (req, res) => {
        const errors = validationResult(req)
        console.log(errors)
        const {
            email,
            password,
            passwordConfirmation
        } = req.body

        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({
            email,
            password
        })
        // Store the id of that user inside of the users cookie
        req.session.userId = user.id // Object ession is added by cookie session!
        res.send('Account Created!')
    })

router.get('/signout', (req, res) => {
    req.session = null
    res.send('You are logged out')
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate())
})

router.post('/signin', async (req, res) => {
    const {
        email,
        password
    } = req.body
    const user = await usersRepo.getOneBy({
        email
    })

    if (!user) {
        return res.send('Email not found')
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password, password
    )

    if (!validPassword) {
        return res.send('Invalid password')
    }

    req.session.userId = user.id

    res.send('You are signed in!')
})

module.exports = router