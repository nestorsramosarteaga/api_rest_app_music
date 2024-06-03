// Importar conexion a db
const { connection } = require("./database/connection");

// Importar dependencias
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;

console.log("API REST with nodeJs App Started!");

// Ejecutar conecion a bd
connection();

// Crear servidor de node
const app = express();

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos JS
app.use(express.urlencoded({extended: true}));

// Cargar configuracion rutas
const UserRoutes = require("./routes/user");
const ArtistRoutes = require("./routes/artist");
const AlbumRoutes = require("./routes/album");
const SongRoutes = require("./routes/song");

app.use("/api/user", UserRoutes);
app.use("/api/artist", ArtistRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/song", SongRoutes);

// Ruta de prueba
app.get("/testing", (req, res) => { 
    return res.status(200).send({
        "id": 1,
        "firstname": "Test",
        "lastname": "AppMusic"
    });
});

// Poner el server a escuchar peticiones HTTP
app.listen(port, () => { 
    console.log(`Server running on port ${port}`);
});
