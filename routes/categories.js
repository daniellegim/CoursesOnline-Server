const express = require('express')
const router = express.Router()
const Categories = require('../models/category')

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Categories.find()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    const categories = new Categories(req.body.newCategories)

    try {
        const newCategories = await categories.save()
        res.status(200).json(newCategories)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/', async (req, res) => {
    try {
        const category = await Categories.findOneAndUpdate({ _id: req.body.category._id }, { name: req.body.category.name })
        res.status(200).json(category)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router