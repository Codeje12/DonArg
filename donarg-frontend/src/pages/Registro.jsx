import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { registrarUsuario, nombreUsuarioDisponible, reenviarVerificacion } from '../services/usuarioService'
import LogoIcon from '../components/LogoIcon'
import Wordmark from '../components/Wordmark'

const formInicial = {
    nombre: '', apellido: '', email: '', nombreUsuario: '',
    password: '', password2: '', dni: '', fechaNacimiento: '',
}

function calcularEdad(fecha) {
    if (!fecha) return null
    const ms = Date.now() - new Date(fecha).getTime()
    return ms / (365.25 * 24 * 60 * 60 * 1000)
}

// Mismas reglas que UsuarioRegistroRequest en el backend, para avisar
// el error antes de mandar el pedido (el backend igual las vuelve a chequear).
function validarPaso1(form) {
    const errores = {}

    if (!form.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
    if (!form.apellido.trim()) errores.apellido = 'El apellido es obligatorio'

    if (!form.email.trim()) {
        errores.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errores.email = 'El email no tiene un formato valido'
    }

    if (!form.nombreUsuario.trim()) {
        errores.nombreUsuario = 'El usuario es obligatorio'
    } else if (form.nombreUsuario.trim().length < 3) {
        errores.nombreUsuario = 'Al menos 3 caracteres'
    } else if (!/^[a-zA-Z0-9._]+$/.test(form.nombreUsuario.trim())) {
        errores.nombreUsuario = 'Solo letras, numeros, puntos y guiones bajos'
    }

    if (!form.password) {
        errores.password = 'La contrasena es obligatoria'
    } else if (form.password.length < 8) {
        errores.password = 'Minimo 8 caracteres'
    }

    if (!form.password2) {
        errores.password2 = 'Confirma tu contrasena'
    } else if (form.password2 !== form.password) {
        errores.password2 = 'Las contrasenas no coinciden'
    }

    return errores
}

function validarPaso2(form) {
    const errores = {}
    const dniDigitos = form.dni.replace(/\D/g, '')

    if (dniDigitos.length < 7 || dniDigitos.length > 8) {
        errores.dni = 'El DNI tiene 7 u 8 digitos'
    }

    if (!form.fechaNacimiento) {
        errores.fechaNacimiento = 'Ingresa tu fecha de nacimiento'
    } else {
        const edad = calcularEdad(form.fechaNacimiento)
        if (edad < 18) errores.fechaNacimiento = 'Tenes que ser mayor de 18'
        else if (edad > 110) errores.fechaNacimiento = 'Revisa la fecha'
    }

    return errores
}

function fuerzaPassword(p) {
    if (!p) return { pct: 0, label: '—', color: 'bg-neutral-200' }
    let n = 0
    if (p.length >= 8) n++
    if (p.length >= 12) n++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) n++
    if (/\d/.test(p)) n++
    if (/[^A-Za-z0-9]/.test(p)) n++
    const niveles = [
        { pct: 14, label: 'Muy debil', color: 'bg-red-500' },
        { pct: 30, label: 'Debil', color: 'bg-orange-500' },
        { pct: 52, label: 'Aceptable', color: 'bg-amber-500' },
        { pct: 72, label: 'Buena', color: 'bg-emerald-600' },
        { pct: 88, label: 'Fuerte', color: 'bg-emerald-600' },
        { pct: 100, label: 'Excelente', color: 'bg-emerald-600' },
    ]
    return niveles[Math.min(n, 5)]
}

function Registro() {
    const { setUsuarioActual } = useUsuario()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [form, setForm] = useState(formInicial)
    const [tocado, setTocado] = useState({})
    const [errorGeneral, setErrorGeneral] = useState(null)
    const [erroresServidor, setErroresServidor] = useState({})
    const [enviando, setEnviando] = useState(false)
    const [usuarioCreado, setUsuarioCreado] = useState(null)
    const [reenviando, setReenviando] = useState(false)
    const [reenviado, setReenviado] = useState(false)

    const [chequeandoUsuario, setChequeandoUsuario] = useState(false)
    const [usuarioDisponible, setUsuarioDisponibleState] = useState(null)

    useEffect(() => {
        const valor = form.nombreUsuario.trim()
        if (valor.length < 3 || !/^[a-zA-Z0-9._]+$/.test(valor)) {
            setUsuarioDisponibleState(null)
            return
        }
        setChequeandoUsuario(true)
        const timer = setTimeout(() => {
            nombreUsuarioDisponible(valor)
                .then(response => setUsuarioDisponibleState(response.data))
                .catch(() => setUsuarioDisponibleState(null))
                .finally(() => setChequeandoUsuario(false))
        }, 400)
        return () => clearTimeout(timer)
    }, [form.nombreUsuario])

    const erroresPaso1 = validarPaso1(form)
    const erroresPaso2 = validarPaso2(form)

    function handleChange(e) {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
        setTocado(t => ({ ...t, [name]: true }))
        if (erroresServidor[name]) {
            setErroresServidor(er => {
                const copia = { ...er }
                delete copia[name]
                return copia
            })
        }
    }

    function errorDe(campo, erroresPaso) {
        return erroresServidor[campo] || (tocado[campo] ? erroresPaso[campo] : null)
    }

    function avanzarAPaso2(e) {
        e.preventDefault()
        setTocado(t => ({ ...t, nombre: true, apellido: true, email: true, nombreUsuario: true, password: true, password2: true }))
        if (Object.keys(erroresPaso1).length === 0) {
            setStep(2)
        }
    }

    function volverAPaso1() {
        setStep(1)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setTocado(t => ({ ...t, dni: true, fechaNacimiento: true }))
        if (Object.keys(erroresPaso2).length > 0) return

        setErrorGeneral(null)
        setEnviando(true)

        const payload = {
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            email: form.email.trim(),
            nombreUsuario: form.nombreUsuario.trim(),
            password: form.password,
            dni: form.dni.replace(/\D/g, ''),
            fechaNacimiento: form.fechaNacimiento,
        }

        registrarUsuario(payload)
            .then(response => {
                setUsuarioCreado(response.data)
                setStep(3)
            })
            .catch(err => {
                const data = err.response?.data
                if (data?.errores) {
                    setErroresServidor(data.errores)
                    setStep(1)
                } else {
                    setErrorGeneral(data?.message || 'No se pudo crear el usuario')
                }
            })
            .finally(() => setEnviando(false))
    }

    function handleReenviar() {
        if (!usuarioCreado) return
        setReenviando(true)
        setReenviado(false)
        reenviarVerificacion(usuarioCreado.id)
            .then(() => setReenviado(true))
            .finally(() => setReenviando(false))
    }

    function irAMiPerfil() {
        setUsuarioActual(usuarioCreado)
        navigate('/mi-cuenta')
    }

    const fuerza = fuerzaPassword(form.password)
    const usuarioOk = usuarioDisponible === true && !chequeandoUsuario

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden grid md:grid-cols-[360px_1fr]">

                <div className="hidden md:flex flex-col justify-between bg-emerald-900 text-white p-10">
                    <div className="flex items-center gap-2">
                        <LogoIcon size={26} variante="negativo" />
                        <Wordmark variante="negativo" className="text-lg font-extrabold" />
                    </div>
                    <div className="space-y-5">
                        <h2 className="text-3xl font-extrabold leading-tight">Lo que ya no usás, a alguien le sirve.</h2>
                        <p className="text-emerald-200 text-sm leading-relaxed">
                            Publicá objetos en desuso, recibí ofertas y coordiná la entrega por chat. Sin plata, sin intermediarios.
                        </p>
                        <ul className="space-y-2 text-sm text-emerald-100">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Publicar y ofertar es gratis</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Perfiles verificados por email</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Coordinás la entrega por chat</li>
                        </ul>
                    </div>
                    <div className="h-28 rounded-xl border border-dashed border-emerald-700" />
                </div>

                <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-8 text-sm">
                        {['Cuenta', 'Identidad', 'Verificación'].map((label, i) => {
                            const n = i + 1
                            const activo = step === n
                            const pasado = step > n
                            return (
                                <div key={label} className="flex items-center gap-3">
                                    {i > 0 && <div className="w-8 h-px bg-neutral-200" />}
                                    <div className="flex items-center gap-2">
                                        <div className={
                                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ' +
                                            (pasado ? 'bg-emerald-600 text-white' : activo ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400')
                                        }>
                                            {n}
                                        </div>
                                        <span className={activo || pasado ? 'font-semibold text-neutral-900' : 'text-neutral-400'}>{label}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {step === 1 && (
                        <form onSubmit={avanzarAPaso2} noValidate className="space-y-5">
                            <div>
                                <h1 className="text-2xl font-extrabold text-neutral-900">Creá tu cuenta</h1>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700">Nombre</label>
                                    <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Lucía"
                                        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                    {errorDe('nombre', erroresPaso1) && <p className="text-xs text-red-600 mt-1">{errorDe('nombre', erroresPaso1)}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700">Apellido</label>
                                    <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ferrari"
                                        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                    {errorDe('apellido', erroresPaso1) && <p className="text-xs text-red-600 mt-1">{errorDe('apellido', erroresPaso1)}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-neutral-700">Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="vos@correo.com"
                                    className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                {errorDe('email', erroresPaso1) && <p className="text-xs text-red-600 mt-1">{errorDe('email', erroresPaso1)}</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-neutral-700">Usuario</label>
                                <input name="nombreUsuario" value={form.nombreUsuario} onChange={handleChange} placeholder="lucia.f"
                                    className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                {errorDe('nombreUsuario', erroresPaso1)
                                    ? <p className="text-xs text-red-600 mt-1">{errorDe('nombreUsuario', erroresPaso1)}</p>
                                    : usuarioDisponible === false
                                        ? <p className="text-xs text-red-600 mt-1">Ese usuario ya está tomado</p>
                                        : usuarioOk && <p className="text-xs text-emerald-700 mt-1">{form.nombreUsuario} está disponible</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700">Contraseña</label>
                                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres"
                                        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="flex-1 h-1 rounded-full bg-neutral-200 overflow-hidden">
                                            <div className={'h-1 rounded-full ' + fuerza.color} style={{ width: `${fuerza.pct}%` }} />
                                        </div>
                                        <span className="text-xs text-neutral-500 whitespace-nowrap">{fuerza.label}</span>
                                    </div>
                                    {errorDe('password', erroresPaso1) && <p className="text-xs text-red-600 mt-1">{errorDe('password', erroresPaso1)}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700">Confirmar contraseña</label>
                                    <input type="password" name="password2" value={form.password2} onChange={handleChange} placeholder="Repetila"
                                        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                    {errorDe('password2', erroresPaso1)
                                        ? <p className="text-xs text-red-600 mt-1">{errorDe('password2', erroresPaso1)}</p>
                                        : form.password2 && form.password2 === form.password && <p className="text-xs text-emerald-700 mt-1">Coinciden</p>}
                                </div>
                            </div>

                            <p className="text-xs text-neutral-400">
                                ¿Ya tenés cuenta? <Link to="/login" className="text-emerald-700 hover:underline">Iniciá sesión</Link>
                            </p>

                            <button type="submit" className="w-full bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-emerald-700">
                                Continuar
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div>
                                <h1 className="text-2xl font-extrabold text-neutral-900">Confirmá tu identidad</h1>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Sirve para el circuito de confianza entre quien dona y quien recibe. No se muestra en tu perfil público.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700">DNI</label>
                                    <input name="dni" value={form.dni} onChange={handleChange} placeholder="34567890"
                                        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                    {errorDe('dni', erroresPaso2) && <p className="text-xs text-red-600 mt-1">{errorDe('dni', erroresPaso2)}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700">Fecha de nacimiento</label>
                                    <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange}
                                        className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                                    {errorDe('fechaNacimiento', erroresPaso2) && <p className="text-xs text-red-600 mt-1">{errorDe('fechaNacimiento', erroresPaso2)}</p>}
                                </div>
                            </div>

                            <div className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                                <p className="text-sm text-emerald-900">
                                    Por ahora guardamos el DNI tal cual lo cargás, y solo lo usamos para resolver reportes. El cifrado en base va a sumarse más adelante.
                                </p>
                            </div>

                            {errorGeneral && <p className="text-sm text-red-600">{errorGeneral}</p>}

                            <div className="flex gap-3">
                                <button type="button" onClick={volverAPaso1}
                                    className="px-5 py-2.5 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-neutral-400">
                                    Volver
                                </button>
                                <button type="submit" disabled={enviando}
                                    className="flex-1 bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                                    {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && usuarioCreado && (
                        <div className="space-y-5 max-w-md">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <div className="w-5 h-5 rounded bg-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-neutral-900">Revisá tu casilla</h1>
                                <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                                    Mandamos un link de verificación a <span className="font-semibold text-neutral-900">{usuarioCreado.email}</span>.
                                    Vence en 24 horas. Como todavía no tenemos envío de mails configurado, el link quedó impreso en la consola del backend.
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <button onClick={handleReenviar} disabled={reenviando}
                                    className="px-5 py-2.5 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-50">
                                    {reenviando ? 'Reenviando...' : 'Reenviar link'}
                                </button>
                                <button onClick={irAMiPerfil}
                                    className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                                    Ir a mi perfil
                                </button>
                            </div>
                            {reenviado && <p className="text-xs text-emerald-700">Reenviado — revisá la consola del backend de nuevo.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Registro
