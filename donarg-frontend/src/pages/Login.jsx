import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { loginUsuario } from '../services/usuarioService'
import LogoIcon from '../components/LogoIcon'
import Wordmark from '../components/Wordmark'

const INTENTOS_INICIALES = 5

function Login() {
    const { setUsuarioActual } = useUsuario()
    const navigate = useNavigate()

    const [identificador, setIdentificador] = useState('')
    const [password, setPassword] = useState('')
    const [recordar, setRecordar] = useState(true)
    const [tocado, setTocado] = useState({})
    const [loading, setLoading] = useState(false)
    const [aviso, setAviso] = useState(null) // null | 'malas' | 'bloqueada'
    const [intentos, setIntentos] = useState(INTENTOS_INICIALES)

    const errorId = tocado.identificador && !identificador.trim() ? 'Ingresá tu email o usuario' : null
    const errorPass = tocado.password && !password ? 'Ingresá tu contraseña' : null

    function handleSubmit(e) {
        e.preventDefault()
        setTocado({ identificador: true, password: true })
        if (!identificador.trim() || !password || aviso === 'bloqueada') return

        setLoading(true)
        loginUsuario({ identificador: identificador.trim(), password })
            .then(response => {
                setUsuarioActual(response.data, recordar)
                navigate('/mi-cuenta')
            })
            .catch(() => {
                setIntentos(prev => {
                    const restantes = Math.max(0, prev - 1)
                    setAviso(restantes === 0 ? 'bloqueada' : 'malas')
                    return restantes
                })
            })
            .finally(() => setLoading(false))
    }

    const submitDisabled = loading || aviso === 'bloqueada'

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden grid md:grid-cols-[360px_1fr]">

                <div className="hidden md:flex flex-col justify-between bg-emerald-900 text-white p-10">
                    <div className="flex items-center gap-2">
                        <LogoIcon size={26} variante="negativo" />
                        <Wordmark variante="negativo" className="text-lg font-extrabold" />
                    </div>
                    <div className="space-y-5">
                        <h2 className="text-3xl font-extrabold leading-tight">Bienvenida de vuelta.</h2>
                        <p className="text-emerald-200 text-sm leading-relaxed">
                            Tenés ofertas esperando respuesta y entregas por coordinar.
                        </p>
                    </div>
                    <div className="h-28 rounded-xl border border-dashed border-emerald-700" />
                </div>

                <div className="p-8 md:p-10">
                    <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-md">
                        <div>
                            <h1 className="text-2xl font-extrabold text-neutral-900">Entrá a tu cuenta</h1>
                            <p className="text-sm text-neutral-500 mt-1">
                                ¿No tenés cuenta? <Link to="/registro" className="text-emerald-700 hover:underline">Registrate</Link>
                            </p>
                        </div>

                        {aviso === 'malas' && (
                            <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-red-800">Email o contraseña incorrectos</p>
                                    <p className="text-sm text-red-700 mt-0.5">
                                        Te quedan {intentos} intento{intentos === 1 ? '' : 's'} antes de bloquear el acceso por 15 minutos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {aviso === 'bloqueada' && (
                            <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-red-800">Demasiados intentos fallidos</p>
                                    <p className="text-sm text-red-700 mt-0.5">
                                        Por seguridad bloqueamos el acceso por 15 minutos.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button type="button" className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
                            <span className="w-4.5 h-4.5 rounded-full" style={{ background: 'conic-gradient(#EA4335 0 25%, #FBBC05 25% 50%, #34A853 50% 75%, #4285F4 75% 100%)' }} />
                            Continuar con Google
                        </button>

                        <div className="flex items-center gap-3.5">
                            <div className="flex-1 h-px bg-neutral-200" />
                            <span className="text-xs font-semibold text-neutral-400 tracking-wide">O CON TU EMAIL</span>
                            <div className="flex-1 h-px bg-neutral-200" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-neutral-700">Email o usuario</label>
                            <input
                                value={identificador}
                                onChange={e => { setIdentificador(e.target.value); setTocado(t => ({ ...t, identificador: true })); setAviso(null) }}
                                placeholder="vos@correo.com"
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            {errorId && <p className="text-xs text-red-600 mt-1">{errorId}</p>}
                        </div>

                        <div>
                            <div className="flex items-baseline justify-between gap-3">
                                <label className="text-sm font-medium text-neutral-700">Contraseña</label>
                                <span className="text-xs text-neutral-300 cursor-not-allowed" title="La recuperación de contraseña todavía no está disponible">
                                    Olvidé mi contraseña
                                </span>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setTocado(t => ({ ...t, password: true })); setAviso(null) }}
                                placeholder="Tu contraseña"
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            {errorPass && <p className="text-xs text-red-600 mt-1">{errorPass}</p>}
                        </div>

                        <label className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={recordar}
                                onChange={e => setRecordar(e.target.checked)}
                                className="w-4 h-4 accent-emerald-600"
                            />
                            Mantener la sesión abierta
                        </label>

                        <button
                            type="submit"
                            disabled={submitDisabled}
                            className="w-full bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:bg-neutral-400"
                        >
                            {loading ? 'Entrando...' : aviso === 'bloqueada' ? 'Acceso bloqueado 15 min' : 'Iniciar sesión'}
                        </button>

                        <p className="text-xs text-neutral-400 text-center pt-2 border-t border-neutral-100">
                            Cuidamos tus datos. Nunca publicamos en tu nombre.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
