const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controller/user');
const { authorizePermissions } = require('../middleware/authentication');


router.route('/').get(getAllUsers).post(authorizePermissions('ADMIN', 'SUPERVISOR'), createUser);
router.route('/:id').get(getUser).patch(authorizePermissions('ADMIN', 'SUPERVISOR'), updateUser).delete(deleteUser);

module.exports = router;