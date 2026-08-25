import api from './api'

export function registrarUsuario(data) {
    return api.post('/usuarios', data)
}

export function loginUsuario(data) {
    return api.post('/usuarios/login', data)
}

export function buscarUsuarioPorId(id) {
    return api.get(`/usuarios/${id}`)
}

export function nombreUsuarioDisponible(valor) {
    return api.get('/usuarios/nombre-usuario-disponible', { params: { valor } })
}

export function verificarEmail(token) {
    return api.get('/usuarios/verificar-email', { params: { token } })
}

export function reenviarVerificacion(id) {
    return api.post(`/usuarios/${id}/reenviar-verificacion`)
}
