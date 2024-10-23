const register = (req, res) => {
    res.send('Register route');
}

const login = (req, res) => {
    res.send('Login route');
}

const logout = (req, res) => {
    res.send('Logout route');
}

const getProfile = (req, res) => {
    res.send('Get Profile route');
}

export { register, login, logout, getProfile };