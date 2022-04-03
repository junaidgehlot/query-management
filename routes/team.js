const express = require('express');
const router = express.Router();
const { authorizePermissions } = require('../middleware/authentication');
const  {
    createTeam,
    getAllTeams,
    getTeam,
    updateTeam,
    deleteTeam
} = require('../controller/team');


router.route('/').get(authorizePermissions('ADMIN', 'SUPERVISOR'), getAllTeams).post(authorizePermissions('ADMIN', 'SUPERVISOR'), createTeam);
router.route('/:id').get(authorizePermissions('ADMIN', 'SUPERVISOR'),getTeam).patch(authorizePermissions('ADMIN', 'SUPERVISOR'), updateTeam).delete(authorizePermissions('ADMIN', 'SUPERVISOR'), deleteTeam);

module.exports = router;