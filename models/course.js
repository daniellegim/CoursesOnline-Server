const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    }
}, { collection: "courses" })

module.exports = mongoose.model('Course', courseSchema)