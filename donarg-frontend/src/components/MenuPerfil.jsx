import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'

// Placeholder fijo: no hay sistema de notificaciones todavia (ver MiCuenta.jsx)
const NOTIFICACIONES_HARDCODEADAS = 3

function claseEnlace(activo) {
    return `block px-4 py-2.5 text-sm rounded-lg ${
        activo ? 'bg-emerald-50 text-emerald-800 font-medium' : 'text-neutral-700 hover:bg-neutral-50'
    }`
}

function MenuPerfil() {
    const { usuarioActual, cerrarSesion } = useUsuario()
    const [abierto, setAbierto] = useState(false)
    const location = useLocation()
    const contenedorRef = useRef(null)

    useEffect(() => {
        function handleClickFuera(e) {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClickFuera)
        return () => document.removeEventListener('mousedown', handleClickFuera)
    }, [])

    if (!usuarioActual) {
        return null
    }

    const inicialApellido = usuarioActual.apellido ? `${usuarioActual.apellido.charAt(0)}.` : ''

    return (
        <div className="relative" ref={contenedorRef}>
            <button
                onClick={() => setAbierto(a => !a)}
                className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-full pl-3 pr-1.5 py-1"
            >
                <span className="text-sm font-medium text-neutral-800">
                    {usuarioActual.nombre} {inicialApellido}
                </span>
                <span className="relative w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600">
                    {usuarioActual.nombre?.charAt(0)}
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {NOTIFICACIONES_HARDCODEADAS}
                    </span>
                </span>
            </button>

            {abierto && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-neutral-200 shadow-lg py-2 z-20">
                    <div className="px-4 py-2">
                        <p className="text-sm font-bold text-neutral-900">
                            {usuarioActual.nombre} {usuarioActual.apellido}
                        </p>
                        {usuarioActual.nombreUsuario && (
                            <p className="text-xs text-neutral-500">@{usuarioActual.nombreUsuario}</p>
                        )}
                    </div>

                    <hr className="my-1.5 border-neutral-100" />

                    <Link to="/mis-publicaciones" onClick={() => setAbierto(false)} className={claseEnlace(location.pathname === '/mis-publicaciones')}>
                        Mis publicaciones
                    </Link>
                    <Link to="/mensajes" onClick={() => setAbierto(false)} className={claseEnlace(location.pathname === '/mensajes')}>
                        Mensajes
                    </Link>
                    <Link to="/mi-cuenta" onClick={() => setAbierto(false)} className={claseEnlace(location.pathname === '/mi-cuenta')}>
                        Datos de la cuenta
                    </Link>

                    <hr className="my-1.5 border-neutral-100" />

                    <button
                        onClick={cerrarSesion}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    )
}

export default MenuPerfil
