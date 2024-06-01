// Importar conexion a db
const { connection } = require("./database/connection");

// Importar dependencias
const express = require('express');
const cors = require('cors');

console.log("API REST with nodeJs App Started!");

// Ejecutar conecion a bd
connection();

// Crear servidor de node
const app = express();
const port = 3911

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos JS
app.use(express.urlencoded({extended: true}));

// Cargar configuracion rutas

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


