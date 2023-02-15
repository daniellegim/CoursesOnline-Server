const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = 5000
const http = require("http");
const socketIo = require('socket.io')
const chatBot = require('./routes/chatService');
chatBot.trainChatBotIA();
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
const levelRouter = require('./routes/levels')
const adminRouter = require('./routes/admin')

const cors = require('cors');
app.use(cors());


app.use('/courses', coursesRouter)
app.use('/usercourses', usercoursesRouter)
app.use('/categories', categoriesRouter)
app.use('/levels', levelRouter)
app.use('/admin', adminRouter)

const server = http.createServer(app);
// app.use('/chatbot',chatBot);
// server.listen()
server.listen(port, () => {
  console.log(`app listening on port ${port}`)

})

const io = socketIo(server,{cors:{origin:"*"}});
chatBot.connectWebSocket(io);
