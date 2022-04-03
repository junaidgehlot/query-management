const mongoose = require('mongoose');
const { authMethods } = require('../db/db-methods');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        maxLength: 50
    },

    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email']
    },

    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/, 'Password should be alphanumeric with min one uppercase, lowercase and, at least one special character']
    },
    role: {
        type: String,
        default: 'ADMIN'
    }
}, { timestamps: true });

authMethods(AdminSchema);


module.exports = mongoose.model('Admin', AdminSchema);