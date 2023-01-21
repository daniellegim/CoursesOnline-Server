const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { collection: "userCourses" })

module.exports = mongoose.model('UserCourse', userCourseSchema)