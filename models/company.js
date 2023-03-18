const mongoose = require("mongoose");


const companySchema = new mongoose.Schema({
    comp_name: {
        type: String,
        required: true
    },
    interview_schedules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview"
    }],
    
}, { timestamps: true });

const company = mongoose.model("Company", batchSchema);

module.exports = company;