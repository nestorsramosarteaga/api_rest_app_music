@echo off

REM Comprobar si el contenedor myMongoDb ya existe
docker ps -a --filter "name=myMongoDb" --format "{{.Names}}" | findstr /r /c:"^myMongoDb$" >nul

REM Verificar el código de salida del último comando
IF %ERRORLEVEL% EQU 0 (
    echo "El contenedor myMongoDb ya existe. Arrancándolo..."
    docker start myMongoDb
) ELSE (
    echo "El contenedor myMongoDb no existe. Creándolo y arrancándolo..."
    docker run -d -p 27020:27017 -v C:\data\db:/data/db --name myMongoDb mongo:7.0
)

REM Arrancar la aplicación
start cmd.exe /k "cd C:\Users\nestor\Documents\MERN\api_rest_app_music && npm run dev"
