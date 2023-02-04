const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { collection: "levels" })

module.exports = mongoose.model('Level', levelSchema)