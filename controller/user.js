const User = require('../models/user');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createUser = async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return new BadRequestError('Please provide name, email and password');
    }

    const user = await User.create({ name, email, role });
    res.status(StatusCodes.OK).json(
        {
            message: `User ${name} successfully created`,
            data: user
        });
}

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: users,
            count: users.length
        });
}

const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.find({ _id: id });
    if (!user) {
        return new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: user
        });
}

const updateUser = async (req, res) => {
    const { params: {id}, body: {name, email, role}, user: {userId} } = req;
    if (!name || !email || !role) {
        return new BadRequestError('Please provide name, email and password');
    }
    const user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
    if (!user) {
        return new NotFoundError('No user to update');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `User successfully updated`,
            data: user
        });
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ _id: id })
    if(!user){
        return new NotFoundError('No user to delete');
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