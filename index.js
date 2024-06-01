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
const port = 3910

// Configurar CORS
app.use(cors());

// Convertir los datos del body a objetos JS
app.use(express.urlencoded({extended: true}));

// Cargar configuraciòn rutas

// Ruta de prueba

// Poner el server a escuchar peticiones HTTP
app.listen(port, () => { 
    console.log(`Server running on port ${port}`);
});


