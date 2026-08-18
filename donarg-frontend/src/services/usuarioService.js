import api from './api'

export function registrarUsuario(data) {
    return api.post('/usuarios', data)
}

export function buscarUsuarioPorId(id) {
    return api.get(`/usuarios/${id}`)
}
