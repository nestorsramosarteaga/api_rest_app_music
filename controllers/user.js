// imports
const validate = require("../helpers/validate");
const User = require("../models/user");

// testing
const testing = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Message sent from user controller"
    });
}

// Register
const register = (req, res) => {

    // Collecting data
    let params = req.body;

    // Verify data
    if(!params.name || !params.nick || !params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Required data is missing"
        });
    }
    // Validate data
    try {
        validate(params);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Validation not passed"
        });
    }

    // Duplicate User Control
    User.find({
        $or: [
            {name: params.email.toLowerCase()},
            {nick: params.nick.toLowerCase()}
        ]
    }).exec( (error, users) => {

        console.log({error,users});
        // Encrypt password

        // Create User's object

        // Save User to Database

        // Clear Object to return

        // Send response
        return res.status(200).send({
            status: "success",
            message: "Register Method"
        });
    });
}


// export
module.exports = {
    testing,
    register
}