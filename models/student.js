const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
    stud_email: {
        type: String,
        required: true,
        unique: true
    },
    stud_name: {
        type: String,
        required: true
    },
    stud_clg: {
        type: String,
        required: true
    },
    stud_batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    stud_dsa: {
        type: Number,
        required: true
    },
    stud_webD: {
        type: Number,
        required: true
    },
    stud_react: {
        type: Number,
        required: true
    },
    stud_interviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview"
    }],
    stud_status: {
        type: String,
        required: true,
        enum: ["Placed", "Not Placed"]
    }
}, { timestamps: true });

const student = mongoose.model("Student", studentSchema);

module.exports = student;