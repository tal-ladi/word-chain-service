const validateUserRegistration = ({ username, email, password }) => {
    const errors = [];

    if (!username || typeof username !== 'string' || username.length < 3) {
        errors.push('Username must be a string with at least 3 characters.');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Invalid email address.');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    return errors;
};

module.exports = {
    validateUserRegistration,
};
