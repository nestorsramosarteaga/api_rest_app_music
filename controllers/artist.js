// Import dependecies
const Artist = require("../models/artist");
const mongoosePagination = require("mongoose-pagination");
const validateImage = require('../helpers/validateImage');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const path = require('path');

// testing
const testing = (req,res) => {
    return res.status(200).send({
        status: "success",
        message: "Message sent from artist controller"
    });
}

// Save Artist
const save = (req, res) => {
    // Collection Artis data
    let params =  req.body;

    // Create Object to save
    let artist = new Artist(params);

    // Save Artist
    artist.save().then( (artistStored) => {
        
        if(!artistStored){
            return res.status(400).send({
                status: "error",
                message: "The artist has not been saved"
            });
        }

        return res.status(200).send({
            status: "success",
            artist: artistStored
        });

    }).catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while saving the Artist",
            error: error.message
        });
    });
}

// Return Artist
const one = async (req, res) => {
    try {
        // Get param from url
        const artistId = req.params.id;

        // Find Artist
        let artist = await Artist.findById(artistId);

        // Check if artist exists
        if(!artist){
            return res.status(404).send({
                status: "error",
                message: "The artist has not been found."
            });
        }

        return res.status(200).send({
            status: "success",
            artist
        });

    } catch(error) {
        // handle errors
        return res.status(500).send({
            status: "error",
            message: "An error occurred while finding the Artist",
            error: error.message
        });
    };

}

// Get a list of artists (with pagination)
const list = async (req, res) => {
    try{
        // get page
        let page = 1;
        if(req.params.page){
            page = req.params.page;
        }

        // Define artist for page
        require('dotenv').config({path:'./.env'});
        const itemsPerPage = parseInt(process.env.ITEM_PER_PAGE) || 5;

        // Get total of artists
        const total = await Artist.countDocuments();

        Artist.find().sort("name")
        .paginate(page, itemsPerPage).then((artists)=>{

            if(!artists){
                return res.status(404).send({
                    status: "error",
                    message: "The artists have not been found."
                });
            }

            return res.status(200).send({
                status: "success",
                page,
                itemsPerPage,
                total,
                docs: artists
            });
        }).catch((error)=>{
            return res.status(500).send({
                status: "error",
                message: "An error occurred while paginating the Artists",
                error: error.message
            });
        });

    } catch(error) {
        // handle errors
        return res.status(500).send({
            status: "error",
            message: "An error occurred while listing the Artists",
            error: error.message
        });
    };

}


const update = (req, res) => {

    // Collection artsit id from url
    const  artistId = req.params.id;

    // Collection artist data from body
    const data = req.body;
    console.log({data, artistId});
    // Seacrh and update artist data
    Artist.findByIdAndUpdate(artistId, data, {new: true}).then( (artistUpdated) => {

        if(!artistUpdated){
            return res.status(404).send({
                status: "error",
                message: "The artist has not been updated"
            });
        }

        // Return response
        return res.status(200).send({
            status: "success",
            artist: artistUpdated
        });

    }).catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while updating the artist",
            error: error.message
        });
    });
}

const remove = async (req, res) => {
    // Get artistId of URL
    const artistId = req.params.id;
    try {
        // Query and remove artist using await
        const artistRemoved = await Artist.findByIdAndDelete(artistId);

        // Remove albums

        // Remove songs

        // Return response
        return res.status(200).send({
            status: "success",
            message: "Artist removed successfully",
            artistRemoved
        });

    } catch(error) {
        return res.status(500).send({
            status: "error",
            message: "An error occurred while removing the artist or some its items (albums/songs)",
            error: error.message
        });
    }
}

const upload = async (req, res) => {
    // Configuracion multer in routes/artist

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
    const extension = path.extname(req.file.originalname).substring(1);

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
    const objectId = new ObjectId(req.params.id);

    let artistUpdated  = await Artist.findOneAndUpdate({_id: objectId},{image: req.file.filename},{new:true});

    try{
        if(!artistUpdated){
            // Remove image file
            fs.unlinkSync(filePath);

            // Return error message
            return res.status(404).send({
                status: "error",
                message: "The artist's image was not found"
            });
        }
        // Return response
        return res.status(200).send({
            status: "success",
            artist: artistUpdated,
            file: req.file
        });
    } catch (error){
        // Remove image file
        fs.unlinkSync(filePath);

        return res.status(500).send({
            status: "error",
            message: "An error has occurred while uploading the image",
            error: error.message
        });
    }
}

const image = (req, res) => {
    // Get param of URL
    const file = req.params.file;

    // Mount the real image path
    const filePath = './uploads/artists/' + file;

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


// export
module.exports = {
    testing,
    save,
    one,
    list,
    update,
    remove,
    upload,
    image
}