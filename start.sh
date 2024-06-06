#!/bin/bash

# Nombre del contenedor
CONTAINER_NAME="myMongoDb"

# Verificar si el contenedor existe
container_exists() {
    docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"
}

# Verificar si el contenedor está corriendo
container_running() {
    docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"
}

# Mensajes de log
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1"
}

# Si el contenedor existe
if container_exists; then
    if container_running; then
        log_info "El contenedor ${CONTAINER_NAME} ya está corriendo."
    else
        log_info "El contenedor ${CONTAINER_NAME} existe pero no está corriendo. Iniciándolo..."
        docker start ${CONTAINER_NAME}
        if [ $? -ne 0 ]; then
            log_error "No se pudo iniciar el contenedor ${CONTAINER_NAME}."
            exit 1
        fi
    fi
else
    # Si el contenedor no existe, crear y arrancar uno nuevo
    log_info "El contenedor ${CONTAINER_NAME} no existe. Creándolo..."
    docker run -d -p 27020:27017 -v /data/db:/data/db --name ${CONTAINER_NAME} mongo:7.0
    if [ $? -ne 0 ]; then
        log_error "No se pudo crear el contenedor ${CONTAINER_NAME}."
        exit 1
    fi
fi

# Ejecutar "npm run dev"
log_info "Ejecutando 'npm run dev'..."
npm run dev
if [ $? -ne 0 ]; then
    log_error "'npm run dev' falló."
    exit 1
fi

log_info "Script completado exitosamente."
