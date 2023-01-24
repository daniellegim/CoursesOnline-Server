const express = require('express')
const router = express.Router()
const UserCourses = require('../models/userCourse')

// Get all courses for user
// router.get('/', async (req, res) => {
//     try {
//         const courses = await Courses.find()
//         res.json(courses)
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })

// Create new course for user
router.post('/', async (req, res) => {
    const courses = req.body.courses.map(course => new UserCourses(course))

    try {
        const newCourses = await UserCourses.insertMany(courses)
        res.status(200).json(newCourses)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router