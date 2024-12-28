const mongoose = require("mongoose")

const authModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    nic: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    doj: {
        type: Date,
        default: Date.now
    },
    lad: {
        type: String,
        required: true
    },
    expertise: {
        type: Array,
        require: true,
    },
    phone: {
        type: String,
        required: true,
    },
    landline: {
        type: String
    },
    male: {
        type: Boolean,
        required: true,
        default: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    },
    activeStatus: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("User", authModel);
module.exports = User;