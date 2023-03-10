const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
    },
    about: {
        type: String,
    },
    duration: {
        type: String
    },
    level:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
    }
}, { collection: "courses" })

module.exports = mongoose.model('Course', courseSchema)