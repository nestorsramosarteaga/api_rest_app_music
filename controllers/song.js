// Import dependecies
const Song = require("../models/song");
const fs = require('fs');
const path = require('path');

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

const one = (req, res) => {
    // Collection songId
    let songId = req.params.id;

    Song.findById(songId).populate("album").exec().then((song)=>{

        if(!song){
            return res.status(404).send({
                status: "error",
                message: "Song not found"
            });
        }

        return res.status(200).send({
            status: "success",
            song
        });

    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error has occurred while searching the song",
            error: error.message
        });
    });
}

const list = (req, res) => {

    // Collectin AlbumId
    let albumId = req.params.albumId;

    // Query
    Song.find({album: albumId})
    .populate({
        path: "album",
        populate: {
            path: "artist",
            model: "Artist"
        }
    })
    .sort("track").exec().then((songs) => {

        if(!songs){
            return res.status(404).send({
                status: "error",
                message: "Songs not found"
            });
        }

        return res.status(200).send({
            status: "success",
            songs
        });

    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "An error has occurred while listing the songs",
            error: error.message
        });
    });

}

const update = (req, res) => {

    // Collection songId
    let songId = req.params.id;

    // Collection Song Data
    let data = req.body;

    // Find and update song
    Song.findByIdAndUpdate(songId, data, {new: true}).then((songUpdated)=>{

        if(!songUpdated){
            return res.status(404).send({
                status: "error",
                message: "The song has not been updated"
            });
        }

        // Return response
        return res.status(200).send({
            status: "success",
            songUpdated
        });

    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while updating the song",
            error: error.message
        });
    });
}

const remove = (req, res) => {

    // Collection songId
    let songId = req.params.id;

    // Search and dremove the song
    Song.findByIdAndDelete(songId).then((songRemoved)=>{

        if(!songRemoved){
            return res.status(404).send({
                status: "error",
                message: "The song has not been removed"
            });
        }

        // Return response
        return res.status(200).send({
            status: "success",
            songRemoved
        });

    })
    .catch((error)=>{
        return res.status(500).send({
            status: "error",
            message: "An error occurred while removing the song",
            error: error.message
        });
    });
}


const upload = async (req, res) => {
    // Configuracion multer in routes/artist

    const songId = req.params.id;

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

    let songUpdated  = await Song.findOneAndUpdate({_id: songId},{file: req.file.filename},{new:true});

    try{
        if(!songUpdated){
            // Remove image file
            fs.unlinkSync(filePath);

            // Return error message
            return res.status(404).send({
                status: "error",
                message: "The song's file was not found"
            });
        }
        // Return response
        return res.status(200).send({
            status: "success",
            song: songUpdated,
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
    const filePath = './uploads/songs/' + file;

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