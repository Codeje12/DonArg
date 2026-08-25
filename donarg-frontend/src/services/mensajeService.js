import api from './api'

export function listarMensajesPorChat(chatId) {
    return api.get('/mensajes', { params: { chatId } })
}

export function enviarMensaje(data) {
    return api.post('/mensajes', data)
}

export function contarMensajesNoLeidos(chatId) {
    return api.get('/mensajes/no-leidos', { params: { chatId } })
}

export function marcarMensajesLeidos(chatId) {
    return api.patch('/mensajes/marcar-leidos', null, { params: { chatId } })
}
