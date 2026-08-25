import api from './api'

export function buscarChatPorPublicacion(publicacionId) {
    return api.get('/chats', { params: { publicacionId } })
}

export function listarMisChats() {
    return api.get('/chats/mios')
}
