// import dependencies
const jwt = require("jwt-simple");
const moment = require("moment");

// import secret key
const { secret } = require("../helpers/jwt");

// create middleware
exports.auth = function (req, res, next) {
    // Check if the auth header exists
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "The request does not have the authentication header",
        });
    }

    // clear token
    let token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        // decode token
        let payload = jwt.decode(token, secret);

        // check token expiration date
        if(payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token expired",
                error
            });
        }

        // add user data to the request
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Invalid token",
            error
        });
    }

    next();
};
