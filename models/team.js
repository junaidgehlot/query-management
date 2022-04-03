const mongoose = require('mongoose');
const User = require('./user');

const userValidator = userRole => async (v) => {
    const user = await User.findOne({ _id: v });
    console.log(user.role);
    return user ? user.role === userRole : false;
}


const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
    },
    supervisor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: [true, 'Team should have a Supervisor'],
        validate: [{
            validator: userValidator('SUPERVISOR'),
            message: 'User should be a supervisor'
        }]
    },
    teamleader: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        unique: true,
        validate: [{
            validator: userValidator('TEAMLEADER'),
            message: 'User should be a teamleader'
        }]
    },
    agents: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }],
        unique: true,
    }
});
;


module.exports = mongoose.model('Team', teamSchema);