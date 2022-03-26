const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('You are not loggedIn');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);
        // @ts-ignore
        req.user = { userId: payload.userID, name: payload.name, role: payload.role }
        console.log(payload);
        next();
    } catch (error) {
        throw new UnauthenticatedError('You are not loggedIn');
    }
}

module.exports = authorize;