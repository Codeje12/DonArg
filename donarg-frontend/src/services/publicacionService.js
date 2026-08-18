import api from './api'

export function obtenerPublicaciones(categoriaId) {
    return api.get('/publicaciones', {
        params: { categoriaId }
    })
}

export function crearPublicacion(data) {
    return api.post('/publicaciones', data)
}