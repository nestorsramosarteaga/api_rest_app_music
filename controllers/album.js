// Import dependecies
const Album = require("../models/album");
const Artist = require("../models/artist");
const Song = require("../models/song");
const validateImage = require('../helpers/validateImage');
const fs = require('fs');
const path = require('path');

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
        return res.status(201).send({
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

    // Find and update album
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

const upload = async (req, res) => {
    // Configuracion multer in routes/artist

    // Collection AlbumId
    const albumId = req.params.id;

    // Collection image file
    if(!req.file){
        return res.status(400).send({
            status: "error",
            message: "The request not include the image file"
        });
    }

    // Get filename
    let image = req.file.originalname;

    // Get imagen extension
    const extension = path.extname(image).substring(1);

    // Check if the extension is valid
    const filePath = req.file.path;
    if(!validateImage(extension)){
        // Remove image file
        const fileDeleted = fs.unlinkSync(filePath);

        // Return error message
        return res.status(400).send({
            status: "error",
            message: "The file extension isn´t allow"
        });
    }

    // If it is OK, then save image in the database
    // const objectId = new ObjectId(req.params.id);

    let albumUpdated  = await Album.findOneAndUpdate({_id: albumId},{image: req.file.filename},{new:true});

    try{
        if(!albumUpdated){
            // Remove image file
            fs.unlinkSync(filePath);

            // Return error message
            return res.status(404).send({
                status: "error",
                message: "The album's image was not found"
            });
        }
        // Return response
        return res.status(200).send({
            status: "success",
            album: albumUpdated,
            file: req.file
        });
    } catch (error){
        // Remove image file
        fs.unlinkSync(filePath);

        return res.status(500).send({
            status: "error",
            message: "An error has occurred while uploading the album's image",
            error: error.message
        });
    }
}

const image = (req, res) => {
    // Get param of URL
    const file = req.params.file;

    // Mount the real image path
    const filePath = './uploads/albums/' + file;

    // Check if the file exists
    fs.stat(filePath, (err, stats) => {

        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send({
                status: 'error',
                message: 'The image does not exist'
                });
            }
            return res.status(500).send({
                status: 'error',
                message: 'Error checking the file'
            });
        }
        return res.sendFile(path.resolve(filePath));
    });
}


const remove = async (req, res) => {

    // Collection albumId
    let albumId = req.params.id;

    try{
        // Remove songs from album
        let songsDeleted = await Song.deleteMany({ album: albumId });
        console.log({songsDeleted});
        // Remover the albuma
        const albumRemoved = await Album.deleteOne({ _id: albumId });
        // Check if the albun was deleted
        if (albumRemoved.deletedCount === 0) {
            return res.status(404).send({
                status: "error",
                message: "Album not found"
            });
        }
        // Send response
        return res.status(200).send({
            status: "success",
            message: "Album and associated songs removed successfully"
        });
    } catch (error){
        return res.status(500).send({
            status: "error",
            message: "An error occurred while removing the album",
            error: error.message
        });
    }
}

// export
module.exports = {
    testing,
    save,
    one,
    list,
    update,
    upload,
    image,
    remove
}