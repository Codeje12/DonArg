import api from './api'

export function obtenerPublicaciones(categoriaId, page = 0, size = 10) {
    return api.get('/publicaciones', {
        params: { categoriaId, page, size }
    })
}

export function crearPublicacion(data) {
    return api.post('/publicaciones', data)
}

export function buscarPublicacionPorId(id) {
    return api.get(`/publicaciones/${id}`)
}

export function actualizarPublicacion(id, data) {
    return api.put(`/publicaciones/${id}`, data)
}

export function elegirInteresado(publicacionId, usuarioElegidoId) {
    return api.patch(`/publicaciones/${publicacionId}/elegir-interesado`, { usuarioElegidoId })
}

export function obtenerMisPublicaciones(usuarioId) {
    return api.get('/publicaciones', { params: { usuarioId, size: 100 } })
}

export function cerrarPublicacion(publicacionId) {
    return api.patch(`/publicaciones/${publicacionId}/cerrar`)
}

export function cancelarPublicacion(publicacionId) {
    return api.patch(`/publicaciones/${publicacionId}/cancelar`)
}