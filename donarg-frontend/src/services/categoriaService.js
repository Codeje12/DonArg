import api from './api'

export function obtenerCategorias() {
    return api.get('/categorias')
}