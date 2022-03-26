const express = require('express');
const router = express.Router();
const  {
    createTeam,
    getAllTeams,
    getTeam,
    updateTeam,
    deleteTeam
} = require('../controller/team');


router.route('/').get(getAllTeams).post(createTeam);
router.route('/:id').get(getTeam).patch(updateTeam).delete(deleteTeam);

module.exports = router;