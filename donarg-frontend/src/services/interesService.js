import api from './api'

export function marcarInteres(data) {
    return api.post('/intereses', data)
}

export function listarInteresesPorPublicacion(publicacionId) {
    return api.get('/intereses', { params: { publicacionId } })
}

export function listarMisIntereses() {
    return api.get('/intereses/mios')
}

// intereses que otros marcaron sobre publicaciones mias
export function listarInteresesRecibidos() {
    return api.get('/intereses/recibidos')
}
