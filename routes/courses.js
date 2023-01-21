const express = require('express')
const router = express.Router()
const Courses = require('../models/course')

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Courses.find()
        res.json(courses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Create new course
router.post('/', async (req, res) => {
    const course = new Courses({
        name: req.body.newCourse.name,
        description: req.body.newCourse.description,
        price: req.body.newCourse.price,
    })
    try {
        const newCourse = await course.save()
        res.status(200).json(newCourse)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router