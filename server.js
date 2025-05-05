const express = require('express')
const logger = require('morgan')
const methodOverride = require('method-override')
require('dotenv').config()
const session = require('express-session')

const authController = require('./controllers/auth.js')

const app = express()

const db = require('./db')

const PORT = process.env.PORT ? process.env.PORT : 3000

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(logger('dev'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use('/auth', authController)

app.get('/', async (req, res) => {
  res.render('./index.ejs', { user: req.session.user })
})

app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`)
    } else {
        res.send("sorry, no guests allowed.")
    }
})

app.listen(PORT, () => {
  console.log(`Express App running on Port ${PORT} . . . `)
})

