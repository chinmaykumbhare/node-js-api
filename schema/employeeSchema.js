const mongoose = require('mongoose');

const employeeModel = mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true,
        index: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 1,
        max: 99
    }
});

module.exports = mongoose.model("employees", employeeModel);