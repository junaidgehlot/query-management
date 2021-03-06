const Team = require('../models/team');
const User = require('../models/user');

const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createTeam = async (req, res) => {
    const { user: { id, role }, body: { name, supervisor, teamleader, agents } } = req;

    if (!supervisor) {
        throw new BadRequestError('Team without supervisor is not allowed');
    }

    if (agents && agents.length === 0) {
        throw new BadRequestError('Add atleast one agent to the team');
    }
    const team = await Team.create({ name, supervisor, teamleader, agents, admin: id });
    await User.updateMany({ "_id": { $in: [supervisor, teamleader, ...agents] } }, { team: team._id });
    res.status(StatusCodes.OK).json({
        msg: `Team ${name} successfully created`,
        data: team
    })
}

const getAllTeams = async (req, res) => {
    const { user: { role, admin } } = req;

    const teams = await Team.find({ admin });
    res.status(StatusCodes.OK).json({
        message: `Teams successfully retrieved`,
        data: teams,
        count: teams.length
    });

}

const getTeam = async (req, res) => {
    const { user: { admin }, params: { id } } = req;

    const team = await Team.findOne({ _id: id, admin });
    if (!team) {
        throw new NotFoundError('No user found');
    }
    res.status(StatusCodes.OK).json({
        message: `Teams successfully retrieved`,
        data: team
    });
}

const updateTeam = async (req, res) => {
    const { user: { admin }, params: { id }, body: { supervisor, teamleader, agents } } = req;
    const team = await Team.findOneAndUpdate({ _id: id }, { admin, teamleader, $addToSet: { 'agents': agents } });
    if (!team) {
        throw new NotFoundError('No team found');
    } else {
        await User.updateMany({ "_id": { $in: [supervisor, teamleader, ...agents] } }, { team: team._id });
    }
    res.status(StatusCodes.OK).json({
        message: `Team successfully updated`
    });
}

const deleteTeam = async (req, res) => {
    const { user: { admin }, params: { id } } = req;
    const team = await Team.findOne({ _id: id, admin });
    if (!team) {
        throw new NotFoundError('No team to delete');
    }
    await User.updateMany({ "_id": { $in: [team.supervisor, team.teamleader, ...team.agents] } }, { $unset: { 'team': '' } });
    team.remove();
    res.status(StatusCodes.OK).json({
        message: `Team successfully deleted`,
        data: team
    });
}



module.exports = {
    createTeam,
    getAllTeams,
    getTeam,
    updateTeam,
    deleteTeam
}