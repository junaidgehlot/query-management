const mongoose = require('mongoose');
const { authMethods } = require('../db/db-methods');


const UserSchema = new mongoose.Schema({
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
        minLength: 6,
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/, 'Password should be alphanumeric with min one uppercase, lowercase and, at least one special character']
    },
    role: {
        type: String,
        ENUM: ['SUPERVISOR', 'TEAMLEADER', 'AGENT'],
        required: [true, 'Please provide role']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide createdBy']
    },
    team: {
        type: mongoose.Types.ObjectId,
        ref: 'Team',
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required: [true, 'Please provide admin']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

authMethods(UserSchema);


UserSchema.virtual('fromAdmin', {
    ref: 'Admin',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});


UserSchema.virtual('fromUser', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});




module.exports = mongoose.model('User', UserSchema);