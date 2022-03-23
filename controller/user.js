const createUser = (req, res) => {
    res.send('Create a user');
}

const getAllUsers = (req, res) => {
    res.send('get all users');
}

const getUser = (req, res) => {
    res.send('get a user');
}

const updateUser = (req, res) => {
    res.send('Update a user');
}

const deleteUser = (req, res) => {
    res.send('Delete a user');
}

module.exports = {
    createUser, 
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}