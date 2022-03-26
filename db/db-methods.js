const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const authMethods = function (customSchema) {

    // @ts-ignore
    customSchema.pre('save', async function () {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    });

    customSchema.methods.createJWT = function () {
        return jwt.sign({ userID: this._id, name: this.name, role: this.role }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRY });
    }

    customSchema.methods.checkPassword = async function (userpassword) {
        if(userpassword && this.password){
            return await bcrypt.compare(userpassword, this.password);
        }
    }
}





module.exports = { authMethods };