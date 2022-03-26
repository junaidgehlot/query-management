const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    supervisor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:[true, 'Team should have a Supervisor']
    },
    teamleader:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    agent: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});


module.exports = mongoose.model('Team', teamSchema);