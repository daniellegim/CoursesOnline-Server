const express = require('express')
const router = express.Router()
const Levels = require('../models/level')

// Get all Levels
router.get('/', async (req, res) => {
    try {
        const levels = await Levels.find()
        res.json(levels)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.post('/', async (req, res) => {
    const levels = new Levels(req.body.newLevels)

    try {
        const newLevels = await levels.save()
        res.status(200).json(newLevels)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router