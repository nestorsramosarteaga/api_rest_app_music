// Import dependecies
const Song = require("../models/song");

// testing
const testing = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Message sent from song controller"
    });
}

const save = (req, res) => {
    // Collection data
    let params = req.body;

    // Create a object using Song model
    let song = new Song(params);

    // Save Song
    song.save().then((songStored) => {

        if(!songStored){
            return res.status(400).send({
                status: "error",
                message: "The song has not been saved"
            });
        }

        // Return response
        return res.status(201).send({
            status: "success",
            song: songStored
        });

    }).catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while saving the Song",
            error: error.message
        });
    });
}

// export
module.exports = {
    testing,
    save
}