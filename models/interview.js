const mongoose = require("mongoose");


const interviewSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    interview_date: {
        type: Date,
        required: true
    },
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        },
        result: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Result"
        }
    }]
}, { timestamps: true });

const interview = mongoose.model("Interview", interviewSchema);

module.exports = interview;