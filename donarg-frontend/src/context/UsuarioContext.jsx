import { createContext, useContext, useEffect, useState } from 'react'
import { buscarUsuarioPorId } from '../services/usuarioService'

const UsuarioContext = createContext(null)

export function UsuarioProvider({ children }) {
    const [usuarioActual, setUsuarioActualState] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuarioId') || sessionStorage.getItem('usuarioId')
        if (!usuarioId) {
            setCargando(false)
            return
        }

        buscarUsuarioPorId(usuarioId)
            .then(response => setUsuarioActualState(response.data))
            .catch(() => {
                localStorage.removeItem('usuarioId')
                sessionStorage.removeItem('usuarioId')
            })
            .finally(() => setCargando(false))
    }, [])

    function setUsuarioActual(usuario, recordar = true) {
        if (recordar) {
            localStorage.setItem('usuarioId', usuario.id)
            sessionStorage.removeItem('usuarioId')
        } else {
            sessionStorage.setItem('usuarioId', usuario.id)
            localStorage.removeItem('usuarioId')
        }
        setUsuarioActualState(usuario)
    }

    function cerrarSesion() {
        localStorage.removeItem('usuarioId')
        sessionStorage.removeItem('usuarioId')
        setUsuarioActualState(null)
    }

    // para cuando cambian datos propios (editar perfil, cambiar email, foto) y hay que
    // refrescar el usuario en memoria sin tocar donde esta guardado el id (local/session storage)
    function actualizarUsuarioActual(usuario) {
        setUsuarioActualState(usuario)
    }

    return (
        <UsuarioContext.Provider value={{ usuarioActual, setUsuarioActual, actualizarUsuarioActual, cerrarSesion, cargando }}>
            {children}
        </UsuarioContext.Provider>
    )
}

export function useUsuario() {
    return useContext(UsuarioContext)
}
