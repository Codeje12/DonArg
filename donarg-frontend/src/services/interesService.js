import api from './api'

export function marcarInteres(data) {
    return api.post('/intereses', data)
}

export function listarInteresesPorPublicacion(publicacionId) {
    return api.get('/intereses', { params: { publicacionId } })
}
