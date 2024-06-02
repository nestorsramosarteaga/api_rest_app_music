// import dependencies
const jwt = require('jwt-simple');
const moment = require('moment');

// Secret key for JWT
const secret = "SECRET_KEY_AppMusic_123456789!";

// Create functio to  generate JWT token
const createToken = (user) => {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix(),
    }

    // Retornar token
    return jwt.encode(payload, secret);

}

// Export module
module.exports = {
    secret,
    createToken
}

