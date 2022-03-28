const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');
const { UnauthenticatedError } = require('../errors');

const authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('You are not loggedIn');
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        let user;
          // @ts-ignore
        if(payload.role === 'ADMIN') {
            // @ts-ignore
            user = await Admin.findOne({ _id: payload.userID});
        }else{
             // @ts-ignore
            user = await User.findOne({ _id: payload.userID});
        }
        req.user = user
        
        console.log(payload);
        next();
    } catch (error) {
        throw new UnauthenticatedError('You are not loggedIn');
    }
}

module.exports = authorize;