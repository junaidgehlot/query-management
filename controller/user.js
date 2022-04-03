const User = require('../models/user');
const Admin = require('../models/admin');
const Team = require('../models/team');

const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createUser = async (req, res) => {
    const { body: { name, email, role }, user: { _id: userId, role: userRole } } = req;
    const userAdmin = userRole !== 'ADMIN' ? req.user.admin : null;
    if (userRole === role) {
        throw new BadRequestError('You cannot create user of same role');
    }
    
    if (!name || !email || !role) {
        throw new NotFoundError('Please provide name, email and password');
    }
    const admin = await Admin.findOne({ email });

    if (admin) {
        throw new BadRequestError('Duplicate value entered for email field, please choose another value');
    }
    const user = await User.create({ name, email, role, createdBy: userId, admin: userAdmin || userId });
    res.status(StatusCodes.OK).json(
        {
            message: `User ${name} successfully created`,
            data: user,
        });
}

const getAllUsers = async (req, res) => {
    const { _id: userId, role } = req.user;
    const queryObject = role === 'ADMIN' ? { admin: userId } : { createdBy: userId };
    const users = await User.find(queryObject);
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: users,
            count: users.length
        });
}

const getUser = async (req, res) => {
    const { params: { id }, user: { _id: userId, role } } = req;
    const queryObject = role === 'ADMIN' ? { admin: userId } : { createdBy: userId };
    const user = await User.findOne({ _id: id, ...queryObject });
    if (!user) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: user,
        });
}

const updateUser = async (req, res) => {
    const { params: { id }, body: { name, email, role, team }, user: { _id: userId, role: userRole } } = req;
    if (!name && !email && !role) {
        throw new BadRequestError('Please provide name, email, role or password');
    }
    if (userRole === role) {
        throw new BadRequestError('You cannot update user of same role');
    }
    const queryObject = role === 'ADMIN' ? { admin: userId } : { createdBy: userId };

    const user = await User.findOneAndUpdate({ _id: id, ...queryObject }, req.body, { new: true, runValidators: true });
    if (!user) {
        throw new NotFoundError('No user to update');
    }

    if (team !== user.team) {
        const team = await Team.findOne({ _id: user.team });
        if (user.role === 'SUPERVISOR') {
            team.supervisor = user._id
        } else if (user.role === 'TEAMLEADER') {
            team.teamleader = user._id
        } else {
            if (team.agents.indexOf(user._id) >= 0) {
                team.agents.push(user._id)
            }
        }
        team.save();
    }

    res.status(StatusCodes.OK).json({
        message: `User successfully updated`,
        data: user
    });
}

const deleteUser = async (req, res) => {
    const { params: { id }, user: { _id: userId, role } } = req;
    const queryObject = role === 'ADMIN' ? { admin: userId } : { createdBy: userId };
    const user = await User.findOne({ _id: id, ...queryObject });
    if (!user) {
        throw new NotFoundError('No user to delete');
    }
    if (user.team) {
        await Team.findOneAndUpdate({ _id: user.team },
            user.role === 'AGENT' ? {
                $pullAll: {
                    agents: user._id,
                }
            } : {
                $unset: user.role === 'SUPERVISOR' ? { 'supervisor': '' } : { 'teamleader': '' }
            });
    }
    user.remove();
    res.status(StatusCodes.OK).json(
        {
            message: `User successfully deleted`
        });
}


module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}