import api from './api'

export function listarOfertasPorPublicacion(publicacionId) {
    return api.get('/ofertas', { params: { publicacionId } })
}
