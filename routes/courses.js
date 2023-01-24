const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const Courses = require('../models/course')

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Courses.find().populate("category")
        res.json(courses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get filtered courses
router.get('/filtered', async (req, res) => {
    const whereClause = {}

    if (req.query.categories) {
        whereClause.category = { $in: req.query.categories }
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
    const course = new Courses(req.body.newCourse)

    try {
        const newCourse = await course.save()
        res.status(200).json(newCourse)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router