const express = require('express')
const logger = require('morgan')
require('dotenv').config()

const authController = require('./controllers/auth.js')

const app = express();

const db = require('./db') //import db file

const PORT = process.env.PORT ? process.env.PORT : "3000";

app.use(express.urlencoded({ extended: false}))

app.use(logger('dev'))

app.use('/auth', authController)

app.get("/", async (req, res) => {
    res.render("./index.ejs")
})

app.listen(PORT, () => {
    console.log(`Express App running on PORT ${PORT}...`)
})

