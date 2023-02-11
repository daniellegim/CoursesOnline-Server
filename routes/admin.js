const express = require('express')
const router = express.Router()
const Admin = require('../models/admin')

// Get admin
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.find({ userId: req.params.id })
        res.json(admin)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router