const express = require('express');
const router = express.Router();
const  {
    createUser, 
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controller/user');


router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;