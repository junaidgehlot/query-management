const Team = require('../models/team');
const User = require('../models/user');

const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createTeam = async (req, res) => {
    const { user: { id, role }, body: { name, supervisor, teamleader, agents } } = req;

    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can create a team');
    }

    if (!supervisor) {
        throw new BadRequestError('Team without supervisor is not allowed');
    }

    if (agents && agents.length === 0) {
        throw new BadRequestError('Add atleast one agent to the team');
    }
    const team = await Team.create({ name, supervisor, teamleader, agents, admin: id });
    const users =  await User.updateMany({ "_id": { $in: [supervisor, teamleader, ...agents] } }, { team: team._id });
    res.status(StatusCodes.OK).json({
        msg: `Team ${name} successfully created`,
        data: team,
        users
    })
}

const getAllTeams = async (req, res) => {
    const { user: { role, admin } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can see this information');
    }

    const teams = await Team.find({ admin });
    res.status(StatusCodes.OK).json(
        {
            message: `Teams successfully retrieved`,
            data: teams,
            count: teams.length
        });

}

const getTeam = async (req, res) => {
    const { user: { role, admin }, params: { id } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can see this information');
    }

    const team = await Team.findOne({ _id: id, admin });
    if (!team) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Teams successfully retrieved`,
            data: team
        });
}

const updateTeam = async (req, res) => {
    const { user: { role, admin }, params: { id }, body: { supervisor, teamleader, agent } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can update a team');
    }
    if (!supervisor) {
        throw new BadRequestError('Team without supervisor is not allowed');
    }
    const team = await Team.findOneAndUpdate({ _id: id, admin });
    if (!team) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json(
        {
            message: `Team successfully updated`
        });
}

const deleteTeam = async (req, res) => {
    const { user: { role, admin }, params: { id } } = req;
    if (role === 'AGENT' || role === 'TEAMLEADER') {
        throw new BadRequestError('Only Admin and supervisor can delete a team');
    }
    const user = await Team.findOneAndDelete({ _id: id, admin })
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