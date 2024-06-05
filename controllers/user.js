// imports
const bcrypt = require("bcrypt");
const validate = require("../helpers/validate");
const User = require("../models/user");
const jwt = require("../helpers/jwt");
const { ObjectId } = require('mongodb');

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
            {email: params.email.toLowerCase()},
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
            message: "An error has occurred registering the user",
            error
        });
    });
}

const login = (req, res) => {
    // Collecting data
    let params = req.body;
    // Verify Data
    if(!params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Required data is missing"
        });
    }

    // Find user in the database
    User.findOne({email: params.email})
    .select("+password +role")
    .exec().then((user) =>{

        if(!user){
            return res.status(404).send({
                status: "error",
                message: "The user does not exist"
            });
        }

        // Check password
        let pwd = bcrypt.compareSync(params.password,user.password);
        if(!pwd){
            return res.status(404).send({
                status: "error",
                message: "Wrong credentials"
            });
        }

        // Clear Object to return
        let identityUser = user.toObject();
        delete identityUser.password;
        delete identityUser.role;

        // Get Token JWT  (Create service than allow create a token)
        const token = jwt.createToken(user);

        // Return user data and Token
        return res.status(200).send({
            status: "success",
            message: "Login Method",
            user: identityUser,
            token
        });

    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred searching for the user",
            error
        });
    });
}


const profile = (req, res) => {

    // Collecting user id
    let id = req.params.id;

    // Get user data
    User.findById(id).then((user) => {

        if(!user) {
            return res.status(404).send({
                status: "error",
                message: "The user does not exist"
            });
        }

        //  Return result
        return res.status(200).send({
            status: "success",
            id,
            user
        });

    });
}

const update = (req, res) => {

    // Collection of identified user data
    let userIdentity = req.user;

    // Data Collectin for update
    let userToUpdate = req.body;

    // Validate data
    try {
        validate(userToUpdate);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Validation not passed"
        });
    }

    // Check if user already exists
    const searchCriteria = { $or: [] };
    if (userToUpdate.email) {
        searchCriteria.$or.push({ email: userToUpdate.email.toLowerCase() });
    }

    // if (userToUpdate.nick) {
    //     searchCriteria.$or.push({ nick: userToUpdate.nick.toLowerCase() });
    // }
    console.log(searchCriteria);
    // Check if user already exists
    if (searchCriteria.$or.length > 0) {
        User.find(searchCriteria).exec().then(async(users) => {

            // Check if user already exists and if it is not the identified user
            let userIsset = false;
            users.forEach(user => {
                console.log({user, userIdentity, 'equals' : user._id.equals(new ObjectId(userIdentity.id))});
                if(user && !user._id.equals(new ObjectId(userIdentity.id))) userIsset = true;
            });

            // If user already exists, Return a response
            if(userIsset){
                return res.status(200).send({
                    status: "success",
                    message: "User already exists"
                });
            }

            // Encrypt password, if it exists in the data
            if(userToUpdate.password){
                let pwd = await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = pwd;
            } else {
                delete userToUpdate.password;
            }

            // Search for user and Update user data
            try{
                let userUpdated = await User.findByIdAndUpdate({_id:userIdentity.id}, userToUpdate, {new: true});

                if(!userUpdated){
                    return res.status(400).send({
                        status: "error",
                        message: "Error updating user data."
                    });
                }

                // Return success
                return res.status(200).send({
                    status: "success",
                    message: "Update Data User Method",
                    user: userUpdated
                });
            }catch(error){
                return res.status(500).send({
                    status: "error",
                    message: "Error updating user data."
                });
            }
        })
        .catch((error)=>{
            return res.status(500).send({
                status: "error",
                message: "An error has occurred while searching for users",
                error
            });
        });
    } else {
        return res.status(500).send({
            status: "error",
            message: "No email or nickname was provided for the search."
        });
    }
}

// export
module.exports = {
    testing,
    register,
    login,
    profile,
    update
}