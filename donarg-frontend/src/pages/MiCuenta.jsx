import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import {
    actualizarDatosPropios,
    cambiarPassword,
    cambiarEmail,
    obtenerDniPropio,
    subirFotoPerfil,
    darDeBaja,
} from '../services/usuarioService'
import { obtenerUrlImagen } from '../services/imagenService'
import MenuPerfil from '../components/MenuPerfil'
import BottomNav from '../components/BottomNav'
import LogoIcon from '../components/LogoIcon'
import Wordmark from '../components/Wordmark'
import DatePicker from '../components/DatePicker'
import Modal from '../components/Modal'

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

function EstadoItem({ activo, children }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${activo ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
            <span className={activo ? 'text-neutral-800' : 'text-neutral-400'}>{children}</span>
        </div>
    )
}

function Campo({ label, ...props }) {
    return (
        <div>
            <label className="text-sm font-medium text-neutral-700">{label}</label>
            <input
                {...props}
                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
        </div>
    )
}

function ModalCambiarPassword({ onCerrar, onListo }) {
    const [form, setForm] = useState({ passwordActual: '', passwordNueva: '', passwordNueva2: '' })
    const [error, setError] = useState(null)
    const [guardando, setGuardando] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        if (form.passwordNueva.length < 8) {
            setError('La contraseña nueva debe tener al menos 8 caracteres')
            return
        }
        if (form.passwordNueva !== form.passwordNueva2) {
            setError('Las contraseñas nuevas no coinciden')
            return
        }

        setGuardando(true)
        cambiarPassword({ passwordActual: form.passwordActual, passwordNueva: form.passwordNueva })
            .then(() => onListo())
            .catch(err => setError(err.response?.data?.message || 'No se pudo cambiar la contraseña'))
            .finally(() => setGuardando(false))
    }

    return (
        <Modal titulo="Cambiar contraseña" onCerrar={onCerrar}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Campo label="Contraseña actual" type="password" name="passwordActual" value={form.passwordActual} onChange={handleChange} required />
                <Campo label="Contraseña nueva" type="password" name="passwordNueva" value={form.passwordNueva} onChange={handleChange} required />
                <Campo label="Confirmar contraseña nueva" type="password" name="passwordNueva2" value={form.passwordNueva2} onChange={handleChange} required />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onCerrar} className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-neutral-400">
                        Cancelar
                    </button>
                    <button type="submit" disabled={guardando} className="flex-1 bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                        {guardando ? 'Guardando...' : 'Cambiar contraseña'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

function ModalCambiarEmail({ usuarioActual, onCerrar, onGuardado }) {
    const [form, setForm] = useState({ nuevoEmail: '', passwordActual: '' })
    const [error, setError] = useState(null)
    const [guardando, setGuardando] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setGuardando(true)
        cambiarEmail(form)
            .then(response => onGuardado(response.data))
            .catch(err => setError(err.response?.data?.message || 'No se pudo cambiar el email'))
            .finally(() => setGuardando(false))
    }

    return (
        <Modal titulo="Cambiar email" onCerrar={onCerrar}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-neutral-500">Email actual: <span className="text-neutral-700">{usuarioActual.email}</span></p>
                <Campo label="Nuevo email" type="email" name="nuevoEmail" value={form.nuevoEmail} onChange={handleChange} required />
                <Campo label="Contraseña actual" type="password" name="passwordActual" value={form.passwordActual} onChange={handleChange} required />
                <p className="text-xs text-neutral-500">Vas a tener que verificar el nuevo email antes de que vuelva a figurar como verificado.</p>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onCerrar} className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-neutral-400">
                        Cancelar
                    </button>
                    <button type="submit" disabled={guardando} className="flex-1 bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                        {guardando ? 'Guardando...' : 'Cambiar email'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

function ModalDarDeBaja({ onCerrar, onConfirmado }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [enviando, setEnviando] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setEnviando(true)
        darDeBaja({ passwordActual: password })
            .then(() => onConfirmado())
            .catch(err => setError(err.response?.data?.message || 'No se pudo dar de baja la cuenta'))
            .finally(() => setEnviando(false))
    }

    return (
        <Modal titulo="Dar de baja mi cuenta" onCerrar={onCerrar}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-neutral-600">
                    Tu cuenta va a quedar desactivada y no vas a poder volver a iniciar sesión. Tus publicaciones y conversaciones existentes no se borran.
                </p>
                <Campo label="Confirmá tu contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onCerrar} className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-neutral-400">
                        Cancelar
                    </button>
                    <button type="submit" disabled={enviando} className="flex-1 bg-red-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {enviando ? 'Dando de baja...' : 'Dar de baja mi cuenta'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

function MiCuenta() {
    const { usuarioActual, actualizarUsuarioActual, cerrarSesion, cargando } = useUsuario()
    const navigate = useNavigate()
    const inputFotoRef = useRef(null)

    const [modalAbierto, setModalAbierto] = useState(null)
    const [subiendoFoto, setSubiendoFoto] = useState(false)
    const [errorFoto, setErrorFoto] = useState(null)
    const [dni, setDni] = useState(null)
    const [cargandoDni, setCargandoDni] = useState(false)
    const [emailCambiado, setEmailCambiado] = useState(false)

    const [formDatos, setFormDatos] = useState({ nombre: '', apellido: '', telefono: '', fechaNacimiento: '' })
    const [errorDatos, setErrorDatos] = useState(null)
    const [guardandoDatos, setGuardandoDatos] = useState(false)
    const [datosGuardados, setDatosGuardados] = useState(false)

    // sincroniza el formulario con el usuario recién cargado (o recién guardado)
    useEffect(() => {
        if (usuarioActual) {
            setFormDatos({
                nombre: usuarioActual.nombre || '',
                apellido: usuarioActual.apellido || '',
                telefono: usuarioActual.telefono || '',
                fechaNacimiento: usuarioActual.fechaNacimiento || '',
            })
        }
    }, [usuarioActual])

    if (cargando) {
        return null
    }

    if (!usuarioActual) {
        return <Navigate to="/login" replace />
    }

    function handleSeleccionarFoto(e) {
        const archivo = e.target.files?.[0]
        e.target.value = ''
        if (!archivo) return

        setErrorFoto(null)
        setSubiendoFoto(true)
        subirFotoPerfil(archivo)
            .then(response => actualizarUsuarioActual(response.data))
            .catch(err => setErrorFoto(err.response?.data?.message || 'No se pudo subir la foto'))
            .finally(() => setSubiendoFoto(false))
    }

    function handleMostrarDni() {
        if (dni !== null) {
            setDni(null)
            return
        }
        setCargandoDni(true)
        obtenerDniPropio()
            .then(response => setDni(response.data.dni))
            .catch(() => setDni(null))
            .finally(() => setCargandoDni(false))
    }

    function handleChangeDatos(e) {
        const { name, value } = e.target
        setFormDatos(f => ({ ...f, [name]: value }))
        setDatosGuardados(false)
    }

    function handleGuardarDatos(e) {
        e.preventDefault()
        setErrorDatos(null)
        setDatosGuardados(false)
        if (!formDatos.fechaNacimiento) {
            setErrorDatos('Ingresá tu fecha de nacimiento')
            return
        }
        setGuardandoDatos(true)
        actualizarDatosPropios(formDatos)
            .then(response => {
                actualizarUsuarioActual(response.data)
                setDatosGuardados(true)
            })
            .catch(err => setErrorDatos(err.response?.data?.message || 'No se pudieron guardar los cambios'))
            .finally(() => setGuardandoDatos(false))
    }

    function handleEmailGuardado(usuario) {
        actualizarUsuarioActual(usuario)
        setModalAbierto(null)
        setEmailCambiado(true)
    }

    function handleBajaConfirmada() {
        cerrarSesion()
        navigate('/')
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
                        <button
                            type="button"
                            onClick={() => inputFotoRef.current?.click()}
                            disabled={subiendoFoto}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center text-center text-xs text-neutral-400 leading-tight overflow-hidden hover:border-emerald-400 disabled:opacity-50"
                            title="Cambiar foto"
                        >
                            {usuarioActual.fotoPerfil ? (
                                <img src={obtenerUrlImagen(usuarioActual.fotoPerfil)} alt="Foto de perfil" className="w-full h-full object-cover" />
                            ) : subiendoFoto ? (
                                'subiendo...'
                            ) : (
                                <>foto<br />perfil</>
                            )}
                        </button>
                        <input ref={inputFotoRef} type="file" accept="image/*" onChange={handleSeleccionarFoto} className="hidden" />

                        <h2 className="mt-4 text-lg font-bold text-neutral-900">
                            {usuarioActual.nombre} {usuarioActual.apellido}
                        </h2>
                        {usuarioActual.nombreUsuario && (
                            <p className="text-sm text-neutral-500">@{usuarioActual.nombreUsuario}</p>
                        )}
                        {errorFoto && <p className="text-xs text-red-600 mt-2">{errorFoto}</p>}
                        <button
                            type="button"
                            onClick={() => inputFotoRef.current?.click()}
                            disabled={subiendoFoto}
                            className="mt-4 border border-neutral-200 rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-50"
                        >
                            {subiendoFoto ? 'Subiendo...' : 'Cambiar foto'}
                        </button>
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
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <form onSubmit={handleGuardarDatos}>
                            <div className="flex items-center justify-between mb-5">
                                <h1 className="text-lg font-bold text-neutral-900">Datos de la cuenta</h1>
                                <button
                                    type="submit"
                                    disabled={guardandoDatos}
                                    className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {guardandoDatos ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Campo label="Nombre" name="nombre" value={formDatos.nombre} onChange={handleChangeDatos} required />
                                <Campo label="Apellido" name="apellido" value={formDatos.apellido} onChange={handleChangeDatos} required />
                                <CampoSoloLectura label="Usuario" valor={usuarioActual.nombreUsuario} />
                                <Campo label="Teléfono" name="telefono" value={formDatos.telefono} onChange={handleChangeDatos} placeholder="Opcional" />
                                <div className="col-span-2">
                                    <DatePicker label="Fecha de nacimiento" name="fechaNacimiento" value={formDatos.fechaNacimiento} onChange={handleChangeDatos} />
                                </div>
                            </div>

                            {errorDatos && <p className="text-xs text-red-600 mt-3">{errorDatos}</p>}
                            {datosGuardados && <p className="text-xs text-emerald-700 mt-3">Cambios guardados</p>}
                        </form>

                        <button
                            type="button"
                            onClick={() => setModalAbierto('password')}
                            className="mt-5 border border-neutral-200 rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
                        >
                            Cambiar clave
                        </button>

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
                                <button
                                    type="button"
                                    onClick={() => setModalAbierto('email')}
                                    className="text-sm text-emerald-700 hover:underline font-medium"
                                >
                                    Cambiar
                                </button>
                            </div>
                        </div>
                        {emailCambiado && (
                            <p className="text-xs text-emerald-700 mt-2">
                                Listo. Mandamos un link de verificación a tu nuevo email — como todavía no hay envío de mails configurado, quedó impreso en la consola del backend.
                            </p>
                        )}

                        <div className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 py-3 mt-3">
                            <div>
                                <p className="text-xs text-neutral-500">DNI</p>
                                <p className="text-sm text-neutral-800 tracking-widest">
                                    {cargandoDni ? 'Cargando...' : dni !== null ? dni : '•• ••• •••'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleMostrarDni}
                                disabled={cargandoDni}
                                className="border border-neutral-200 rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 disabled:opacity-50"
                            >
                                {dni !== null ? 'Ocultar DNI' : 'Mostrar DNI'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setModalAbierto('baja')}
                            className="inline-block mt-6 text-sm text-red-600 hover:underline"
                        >
                            Dar de baja mi cuenta
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />

            {modalAbierto === 'password' && (
                <ModalCambiarPassword onCerrar={() => setModalAbierto(null)} onListo={() => setModalAbierto(null)} />
            )}
            {modalAbierto === 'email' && (
                <ModalCambiarEmail usuarioActual={usuarioActual} onCerrar={() => setModalAbierto(null)} onGuardado={handleEmailGuardado} />
            )}
            {modalAbierto === 'baja' && (
                <ModalDarDeBaja onCerrar={() => setModalAbierto(null)} onConfirmado={handleBajaConfirmada} />
            )}
        </div>
    )
}

export default MiCuenta
