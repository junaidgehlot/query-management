const User = require('../models/user');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createUser = async (req, res) => {
    const { body: { name, email, role }, user: { userId } } = req;
    console.log(req.user);
    if (!name || !email || !role) {
        return new NotFoundError('Please provide name, email and password');
    }

    const user = await User.create({ name, email, role, createdBy: userId });
    res.status(StatusCodes.OK).json(
        {
            message: `User ${name} successfully created`,
            data: user
        });
}

const getAllUsers = async (req, res) => {
    const { userId } = req.user;
    console.log(req.user);
    const users = await User.find({ createdBy: userId });
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: users,
            count: users.length
        });
}

const getUser = async (req, res) => {
    const { params: { id }, user: { userId } } = req;
    const user = await User.find({ _id: id, createdBy: userId });
    if (!user) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: user
        });
}

const updateUser = async (req, res) => {
    const { params: { id },body:{name, email, role}, user: { userId } } = req;
    if (!name && !email && !role) {
        throw new BadRequestError('Please provide name, email and password');
    }
    console.log(req.body)
    const user = await User.findOneAndUpdate({ _id: id, createdBy: userId }, req.body, { new: true, runValidators: true });
    if (!user) {
        throw new NotFoundError('No user to update');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `User successfully updated`,
            // data: user
        });
}

const deleteUser = async (req, res) => {
    const { params: { id }, user: { userId } } = req;
    const user = await User.findOneAndDelete({ _id: id, createdBy: userId })
    if (!user) {
        throw new NotFoundError('No user to delete');
    }
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