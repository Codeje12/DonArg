import { Link, Navigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import MenuPerfil from '../components/MenuPerfil'
import BottomNav from '../components/BottomNav'
import LogoIcon from '../components/LogoIcon'
import Wordmark from '../components/Wordmark'

function CampoSoloLectura({ label, valor }) {
    return (
        <div>
            <label className="text-sm text-neutral-500">{label}</label>
            <div className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-800">
                {valor || <span className="text-neutral-400">—</span>}
            </div>
        </div>
    )
}

function BotonInerte({ children, className = '' }) {
    return (
        <button
            type="button"
            disabled
            title="Todavía no está disponible"
            className={`cursor-not-allowed text-neutral-400 border border-neutral-200 rounded-lg px-4 py-2 text-sm font-medium ${className}`}
        >
            {children}
        </button>
    )
}

function EstadoItem({ activo, children }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${activo ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
            <span className={activo ? 'text-neutral-800' : 'text-neutral-400'}>{children}</span>
        </div>
    )
}

function MiCuenta() {
    const { usuarioActual, cargando } = useUsuario()

    if (cargando) {
        return null
    }

    if (!usuarioActual) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
            <header className="bg-white border-b border-neutral-200">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <LogoIcon size={26} />
                        <Wordmark className="text-lg font-extrabold text-neutral-900" />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm text-neutral-600 hover:text-emerald-700">Explorar</Link>
                        <MenuPerfil />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-[320px_1fr] gap-6">

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center text-center text-xs text-neutral-400 leading-tight">
                            foto<br />perfil
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-neutral-900">
                            {usuarioActual.nombre} {usuarioActual.apellido}
                        </h2>
                        {usuarioActual.nombreUsuario && (
                            <p className="text-sm text-neutral-500">@{usuarioActual.nombreUsuario}</p>
                        )}
                        <BotonInerte className="mt-4">Cambiar foto</BotonInerte>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
                        <h3 className="text-sm font-bold text-neutral-900 mb-1">Estado de la cuenta</h3>

                        <EstadoItem activo={usuarioActual.emailVerificado}>
                            {usuarioActual.emailVerificado ? 'Email verificado' : 'Email sin verificar'}
                        </EstadoItem>

                        {/* dni es obligatorio para registrarse, asi que siempre esta cargado */}
                        <EstadoItem activo={true}>DNI cargado</EstadoItem>

                        {/* no existe verificacion de telefono en el sistema, por eso siempre aparece sin confirmar */}
                        <EstadoItem activo={false}>Teléfono sin confirmar</EstadoItem>

                        <span
                            className="inline-block text-sm text-neutral-300 cursor-not-allowed pt-1"
                            title="Todavía no está disponible"
                        >
                            Confirmar teléfono
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h1 className="text-lg font-bold text-neutral-900">Datos de la cuenta</h1>
                            <BotonInerte>Editar datos</BotonInerte>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <CampoSoloLectura label="Nombre" valor={usuarioActual.nombre} />
                            <CampoSoloLectura label="Apellido" valor={usuarioActual.apellido} />
                            <CampoSoloLectura label="Usuario" valor={usuarioActual.nombreUsuario} />
                            <CampoSoloLectura label="Teléfono" valor={usuarioActual.telefono} />
                            <CampoSoloLectura label="Fecha de nacimiento" valor={usuarioActual.fechaNacimiento} />
                        </div>

                        <BotonInerte className="mt-5">Cambiar clave</BotonInerte>

                        <hr className="my-6 border-neutral-100" />

                        <h3 className="text-sm font-bold text-neutral-900 mb-3">Acceso e identidad</h3>

                        <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 py-3">
                            <div>
                                <p className="text-xs text-neutral-500">Email</p>
                                <p className="text-sm text-neutral-800">{usuarioActual.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                    usuarioActual.emailVerificado
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                }`}>
                                    {usuarioActual.emailVerificado ? 'Verificado' : 'Sin verificar'}
                                </span>
                                <span className="text-sm text-neutral-300 cursor-not-allowed" title="Todavía no está disponible">
                                    Cambiar
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 py-3 mt-3">
                            <div>
                                <p className="text-xs text-neutral-500">DNI</p>
                                {/* el backend nunca expone el DNI real por la API (dato sensible) -- queda siempre tapado */}
                                <p className="text-sm text-neutral-800 tracking-widest">•• ••• •••</p>
                            </div>
                            <BotonInerte>Mostrar DNI</BotonInerte>
                        </div>

                        <span
                            className="inline-block mt-6 text-sm text-red-300 cursor-not-allowed"
                            title="Todavía no está disponible"
                        >
                            Dar de baja mi cuenta
                        </span>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    )
}

export default MiCuenta
