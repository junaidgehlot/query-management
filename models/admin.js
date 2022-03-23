const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

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
    }
}, { timestamps: true });

// @ts-ignore
AdminSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id, name: this.name }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRY });
}

AdminSchema.methods.checkPassword = async function(userpassword){
    return await bcrypt.compare(userpassword, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);