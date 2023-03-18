const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema({
    emp_name: {
        type: String,
        required: true
    },
    emp_email: {
        type: String,
        required: true,
        unique: true
    },
    emp_password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const employee = mongoose.model("Employee", employeeSchema);

module.exports = employee;