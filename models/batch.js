const mongoose = require("mongoose");

// creating schema for batch
const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }]
}, { timestamps: true });

const batch = mongoose.model("Batch", batchSchema);

module.exports = batch;