const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = 5000

mongoose.connect(process.env.DATABASE_URL)
const database = mongoose.connection

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

app.use(express.json())

const coursesRouter = require('./routes/courses')
const usercoursesRouter = require('./routes/userCourses')
const categoriesRouter = require('./routes/categories')
const levelRouter = require('./routes/levels');

app.use('/courses', coursesRouter)
app.use('/usercourses', usercoursesRouter)
app.use('/categories', categoriesRouter)
app.use('/levels', levelRouter)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})