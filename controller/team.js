const Team = require('../models/team');
const User = require('../models/user');

const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createTeam = async (req, res) => {
    const { user: { id, role }, body: { name, supervisor } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can create a team');
    }

    if (!supervisor) {
        throw new BadRequestError('Team without supervisor is not allowed');
    }
    const user = await User.find({ _id: supervisor });
    if (!user) {
        throw new NotFoundError('Selected supervisor does not exist');
    }
    await Team.create(req.body);
    res.status(StatusCodes.OK).json({
        msg: `Team ${name} successfully created`
    })
}

const getAllTeams = async (req, res) => {
    const { user: { role } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can see this information');
    }
    const teams = await Team.find({});
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: teams,
            count: teams.length
        });

}

const getTeam = async (req, res) => {
    const { user: { role }, params: { id } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can see this information');
    }

    const team = await Team.findOne({ _id: id });
    if (!team) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Users successfully retrieved`,
            data: team
        });
}

const updateTeam = async (req, res) => {
    const { user: { role }, params: { id }, body: { supervisor } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can update a team');
    }
    if (!supervisor) {
        throw new BadRequestError('Team without supervisor is not allowed');
    }
    const team = await Team.findOneAndUpdate({ _id: id });
    if (!team) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Team successfully updated`
        });
}

const deleteTeam = async (req, res) => {
    const { user: { role }, params: { id } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can delete a team');
    }
    const user = await Team.findOneAndDelete({ _id: id })
    if (!user) {
        throw new NotFoundError('No user to delete');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Team successfully deleted`
        });
}

module.exports = {
    createTeam,
    getAllTeams,
    getTeam,
    updateTeam,
    deleteTeam
}