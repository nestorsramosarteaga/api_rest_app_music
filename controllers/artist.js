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

        // Rrturn response
        return res.status(200).send({
            status: "success",
            artist: artistUpdated
        });

    }).catch((error)=>{
        return res.status(500).send({
            status: "success",
            message: "An error occurred while updating the artist",
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