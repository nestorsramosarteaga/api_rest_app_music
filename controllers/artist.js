// Import dependecies
const Artist = require("../models/artist");
const mongoosePagination = require("mongoose-pagination");

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

    // get page
    let page = 1;
    if(req.parms?.page){
        page = req.parms.page;
    }

    // Define artist for page
    require('dotenv').config({path:'./.env'});
    const itemsPerPage = process.env.ITEM_PER_PAGE || 5;

    let artists = await Artist.find()
        .sort("name")
        .exec();

    return res.status(200).send({
        status: "success",
        message: "list of artist",
        artists
    });

}


// export
module.exports = {
    testing,
    save,
    one,
    list
}