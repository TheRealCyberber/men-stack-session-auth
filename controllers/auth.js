const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user.js')

router.get("/sign-up", (req, res) => {
    res.render('./auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
    try {   
        const userInDatabase = await User.findOne({username: req.body.username})
        if (userInDatabase) {
            return res.send("Username already taken")
        }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("both passwords dont match")
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    req.body.password = hashedPassword
    const user = await User.create(req.body)
    res.send(`Thanks for signing up ${user.username} your ID is ${user._id}`)
    } catch (error) {
        console.error(error.message)   
    }
})





module.exports = router