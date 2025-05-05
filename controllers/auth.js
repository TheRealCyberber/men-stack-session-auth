const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user.js')

router.get('/sign-up', (req, res) => {
  res.render('./auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  // Best practice is to use a try/catch block...
  try {
    // Checks if a user with this username already exists in our database...
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken!')
    }
    // Makes sure our user's password and confirmPassword are matching...
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
    }
    // Sends the password to bcrypt to be hashed using 12 "salt rounds" (think, 'levels of complexity')...
    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    // Finally, creates the new user in our database...
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword
    })
    res.send(`Thanks for signing up ${user.username}! Your ID is ${user._id}!`)
  } catch (error) {
    // If there is an error, sends back the details of the error...
    console.error(error.message)
  }
})

router.get('/sign-in', (req, res) => {
  res.render('./auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  try {
    // See if the user exists in the database...
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.')
    }
    // Compare user's password with encrypted pw in db...
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    )
    if (!validPassword) {
      return res.send("Login failed. Please try again.")
    }
    // Create the session for the client...
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }
    res.redirect("/")
  } catch (error) {
    console.error(error.message)
  }
})

router.get("/sign-out", (req, res) => {
    req.session.destroy()
    res.redirect('/')
  });  

module.exports = router