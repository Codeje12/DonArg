import axios from 'axios'

export const BACKEND_URL = 'http://localhost:8080'

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    // manda y recibe la cookie de sesion (JSESSIONID); sin esto el backend no reconoce que estamos logueados
    withCredentials: true,
})

// si el backend devuelve 401/403 es porque la sesion ya no es valida (expiro, se reinicio el server, etc.)
// pero el frontend puede seguir pensando que estamos logueados (usuarioId cacheado en storage) -> lo limpiamos
// y mandamos a /login. ojo: se excluye el propio /login, porque ese 401 es "contrasena mal" y ya lo maneja Login.jsx
api.interceptors.response.use(
    response => response,
    error => {
        const esLogin = error.config?.url?.includes('/usuarios/login')
        const sesionMuerta = error.response?.status === 401 || error.response?.status === 403

        if (sesionMuerta && !esLogin) {
            localStorage.removeItem('usuarioId')
            sessionStorage.removeItem('usuarioId')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export default api