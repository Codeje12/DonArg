import api, { BACKEND_URL } from './api'

export function agregarImagen(publicacionId, archivo) {
    const formData = new FormData()
    formData.append('publicacionId', publicacionId)
    formData.append('archivo', archivo)
    return api.post('/imagenes', formData)
}

export function listarImagenesPorPublicacion(publicacionId) {
    return api.get('/imagenes', { params: { publicacionId } })
}

export function obtenerUrlImagen(nombreArchivo) {
    return `${BACKEND_URL}/uploads/${nombreArchivo}`
}
