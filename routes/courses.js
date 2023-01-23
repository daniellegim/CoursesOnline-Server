const express = require('express')
const mongoose = require('mongoose');
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

// Get filtered courses
router.get('/filtered', async (req, res) => {
    const whereClause = {}

    if (req.query.categories) {
        const categories = req.query.categories.map(cat => mongoose.Types.ObjectId(cat))
        whereClause.category = { $in: categories }
    }

    if (req.query.price)
        whereClause.price = { $gte: req.query.price.min, $lte: req.query.price.max }

    if (req.query.rating)
        whereClause.rating = req.query.rating

    try {
        const courses = await Courses.find(whereClause)
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