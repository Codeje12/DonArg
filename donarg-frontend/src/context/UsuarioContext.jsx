import { createContext, useContext, useEffect, useState } from 'react'
import { buscarUsuarioPorId } from '../services/usuarioService'

const UsuarioContext = createContext(null)

export function UsuarioProvider({ children }) {
    const [usuarioActual, setUsuarioActualState] = useState(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuarioId')
        if (!usuarioId) {
            setCargando(false)
            return
        }

        buscarUsuarioPorId(usuarioId)
            .then(response => setUsuarioActualState(response.data))
            .catch(() => localStorage.removeItem('usuarioId'))
            .finally(() => setCargando(false))
    }, [])

    function setUsuarioActual(usuario) {
        localStorage.setItem('usuarioId', usuario.id)
        setUsuarioActualState(usuario)
    }

    function cerrarSesion() {
        localStorage.removeItem('usuarioId')
        setUsuarioActualState(null)
    }

    return (
        <UsuarioContext.Provider value={{ usuarioActual, setUsuarioActual, cerrarSesion, cargando }}>
            {children}
        </UsuarioContext.Provider>
    )
}

export function useUsuario() {
    return useContext(UsuarioContext)
}
