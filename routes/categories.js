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

module.exports = router