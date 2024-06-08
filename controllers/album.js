// Import dependecies
const Album = require("../models/album");
const Artist = require("../models/artist");
const Song = require("../models/song");


// testing
const testing = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Message sent from album controller"
    });
}

// save
const save = (req, res) => {
    // Collecting data from body
    let params = req.body;

    // Create Object to save
    let album = new Album(params);

    // Save Album
    album.save().then((albumStored) => {

        if(!albumStored){
            return res.status(400).send({
                status: "error",
                message: "The album has not been saved"
            });
        }

        // Return response
        return res.status(200).send({
            status: "success",
            album: albumStored
        });

    }).catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while saving the Album",
            error: error.message
        });
    });
}

// export
module.exports = {
    testing,
    save
}