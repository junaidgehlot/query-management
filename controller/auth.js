const Admin = require('../models/admin');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return new BadRequestError('Please provide name, email and password');
    }

    const admin = await Admin.create({ name, email, password });
    const token = admin.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: admin.name }, token });
}


const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return new BadRequestError('Please provide email and password');
    }

    //check email
    const user = await Admin.findOne({ email });
    if (!user) {
        return new NotFoundError(`User with ${email} not found`);
    }

    // check password
    const isPasswordCorrect = user.checkPassword(password);
    if(!isPasswordCorrect){
        return new NotFoundError(`Password Incorrect`);
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });

}


module.exports = {
    login,
    register
}