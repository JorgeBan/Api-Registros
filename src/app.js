const express = require('express')
const session = require('express-session')
const morgan = require('morgan')
const cors = require('cors')
require("dotenv").config();

const app = express()
const UserRoutes = require('./routes/user')

app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

app.use(morgan("dev"))


app.use('/api/user', UserRoutes)

module.exports = app;