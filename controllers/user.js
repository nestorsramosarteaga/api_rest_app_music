// imports
const bcrypt = require("bcrypt");
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
    }).exec().then(async (users) => {
        console.log({users});

        if(users && users.length >= 1) {
            return res.status(200).send({
                status: "error",
                message: "User already exists"
            });
        }
        // Encrypt password
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Create User's object
        let userToSave = new User(params);

        // Save User to Database
        userToSave.save().then( (userStored) => {
            // Clear Object to return
            let userCreated = userToSave.toObject();
            delete userCreated.role;
            delete userCreated.password;

            console.log({userCreated});
            // Send response
            return res.status(200).send({
                status: "success",
                message: "Register Method",
                user: userCreated
            });
        }).catch((error)=>{
            console.log(error);
            throw new Error ("Error saving the user")
        });
    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error has occurred",
            error
        });
    });
}

const login = (req, res) => {
    // Collecting data

    // Check Data

    // Find user in the database

    // Check password

    // Get Token JWT  (Create service than allow create a token)

    // Return user data and Token
    return res.status(200).send({
        status: "success",
        message: "Login Method"
    });

}


// export
module.exports = {
    testing,
    register,
    login
}