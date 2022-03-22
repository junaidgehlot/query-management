const login = (req, res) => {
    res.send('login');
}

const register = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.send('error');
    
    }

    res.send(req.body);
}

module.exports = {
    login,
    register
}