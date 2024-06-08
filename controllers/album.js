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

const one = (req, res) => {
    // Get  albunId
    const albumId = req.params.id;

    // find and populate Artist data
    Album.findById(albumId).populate("artist").exec().then((album) => {
        if(!album){
            return res.status(404).send({
                status: "error",
                message: "Album not found"
            });
        }

        return res.status(200).send({
            status: "success",
            album
        });

    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error has occurred seacrhing the album",
            error
        });
    });
}

// export
module.exports = {
    testing,
    save,
    one
}