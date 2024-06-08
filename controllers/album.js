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
            message: "An error has occurred while searching the album",
            error: error.message
        });
    });
}


const list = (req, res) => {

    // collection artistId
    const artistId = req.params.artistId;

    if(!artistId) {
        return res.status(404).send({
            status: "error",
            message: "Artist not found"
        });
    }

    Album.find({artist: artistId}).populate("artist").exec().then((albums) => {

        if(!albums){
            return res.status(404).send({
                status: "error",
                message: "Albums not found"
            });
        }

        return res.status(200).send({
            status: "success",
            albums
        });

    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "An error has occurred while listing the albums",
            error: error.message
        });
    });
}

const update = (req, res) => {
    // Collection params from url
    const albumId = req.params.id;

    // Collection data from body
    const data = req.body;

    // Find and uodate album
    Album.findByIdAndUpdate(albumId, data, {new: true}).then((albumUpdated)=>{

        if(!albumUpdated){
            return res.status(404).send({
                status: "error",
                message: "The album has not been updated"
            });
        }

        // Return response
        return res.status(200).send({
            status: "success",
            albumUpdated
        });

    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while updating the album",
            error: error.message
        });
    });
}

// export
module.exports = {
    testing,
    save,
    one,
    list,
    update
}