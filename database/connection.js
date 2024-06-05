const mongoose = require('mongoose');

require('dotenv').config({path:'./.env'});

const dbPort = process.env.DB_PORT || 27017;

const connection = async () => {

    try {

        await mongoose.connect("mongodb://localhost:"+dbPort+"/app_music");
        // Parameters
        // useNewUrlParfer: true
        // useInifiedTopology: true
        // useCreateIndex: true

        console.log("Connected to the database.");

    } catch(error) {
        console.log(error);
        throw new Error ("Failed to connect to the database.")
    }

}

module.exports = {
    connection
}