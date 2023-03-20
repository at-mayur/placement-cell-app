const mongoose = require("mongoose");


const resultSchema = new mongoose.Schema({
    comp_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true
    },
    result_stat: {
        type: String,
        required: true,
        enum: ["Pass", "Fail", "On Hold", "Didn't Attempt", "Pending"]
    }
}, { timestamps: true });

const result = mongoose.model("Result", resultSchema);

module.exports = result;