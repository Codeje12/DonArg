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

export function actualizarDatosPropios(data) {
    return api.patch('/usuarios/me', data)
}

export function cambiarPassword(data) {
    return api.patch('/usuarios/me/password', data)
}

export function cambiarEmail(data) {
    return api.patch('/usuarios/me/email', data)
}

export function obtenerDniPropio() {
    return api.get('/usuarios/me/dni')
}

export function subirFotoPerfil(archivo) {
    const formData = new FormData()
    formData.append('archivo', archivo)
    return api.post('/usuarios/me/foto', formData)
}

export function darDeBaja(data) {
    return api.delete('/usuarios/me', { data })
}
