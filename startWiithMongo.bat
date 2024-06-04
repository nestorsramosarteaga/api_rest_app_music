start cmd.exe /k "docker run -d -p 27019:27017 -v C:\data\db:/data/db --name apirest-mongodb mongo:7.0"
start cmd.exe /k "cd E:\MERN\nodejs\api_rest_app_music && npm run dev"