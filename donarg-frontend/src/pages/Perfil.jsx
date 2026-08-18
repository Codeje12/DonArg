import { useState } from 'react'
import { useUsuario } from '../context/UsuarioContext'
import { registrarUsuario } from '../services/usuarioService'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const formInicial = { nombre: '', email: '', telefono: '' }

// Mismas reglas que UsuarioRegistroRequest en el backend, para avisar
// el error antes de mandar el pedido (el backend igual las vuelve a chequear).
function validar(form) {
    const errores = {}

    if (!form.nombre.trim()) {
        errores.nombre = 'El nombre es obligatorio'
    } else if (form.nombre.length > 120) {
        errores.nombre = 'El nombre no puede superar los 120 caracteres'
    }

    if (!form.email.trim()) {
        errores.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errores.email = 'El email no tiene un formato valido'
    } else if (form.email.length > 160) {
        errores.email = 'El email no puede superar los 160 caracteres'
    }

    if (!form.telefono.trim()) {
        errores.telefono = 'El telefono es obligatorio'
    } else if (!/^[0-9+\-\s()]+$/.test(form.telefono)) {
        errores.telefono = 'El telefono solo puede tener numeros'
    } else if (form.telefono.length > 30) {
        errores.telefono = 'El telefono no puede superar los 30 caracteres'
    }

    return errores
}

function Perfil() {
    const { usuarioActual, setUsuarioActual, cerrarSesion, cargando } = useUsuario()
    const [form, setForm] = useState(formInicial)
    const [errores, setErrores] = useState({})
    const [errorGeneral, setErrorGeneral] = useState(null)
    const [enviando, setEnviando] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()

        const erroresValidacion = validar(form)
        setErrores(erroresValidacion)
        if (Object.keys(erroresValidacion).length > 0) {
            return
        }

        setErrorGeneral(null)
        setEnviando(true)

        registrarUsuario(form)
            .then(response => setUsuarioActual(response.data))
            .catch(err => {
                const data = err.response?.data
                if (data?.errores) {
                    setErrores(data.errores)
                } else {
                    setErrorGeneral(data?.message || 'No se pudo crear el usuario')
                }
            })
            .finally(() => setEnviando(false))
    }

    if (cargando) {
        return null
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
            <Header />

            <div className="mx-auto max-w-md px-4 py-8">
                {usuarioActual ? (
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h2 className="text-lg font-semibold text-neutral-900">{usuarioActual.nombre}</h2>
                        <p className="text-sm text-neutral-500 mt-1">{usuarioActual.email}</p>
                        <p className="text-sm text-neutral-500">{usuarioActual.telefono}</p>
                        <p className="text-sm text-neutral-500 mt-3">
                            {usuarioActual.verificado ? 'Usuario verificado' : 'Usuario sin verificar'}
                            {' · '}
                            {usuarioActual.promedioValoracion.toFixed(1)} ★
                        </p>

                        <button
                            onClick={cerrarSesion}
                            className="mt-5 text-sm text-red-600 hover:underline"
                        >
                            Cambiar de usuario
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-neutral-900">Creá tu usuario</h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                Todavía no hay login: esto crea tu usuario y lo deja guardado en este navegador.
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-600">Nombre</label>
                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                maxLength={120}
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errores.nombre && <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-neutral-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                maxLength={160}
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errores.email && <p className="text-xs text-red-600 mt-1">{errores.email}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-neutral-600">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                maxLength={30}
                                placeholder="Ej: 3764123456"
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                            />
                            {errores.telefono && <p className="text-xs text-red-600 mt-1">{errores.telefono}</p>}
                        </div>

                        {errorGeneral && <p className="text-sm text-red-600">{errorGeneral}</p>}

                        <button
                            type="submit"
                            disabled={enviando}
                            className="w-full bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                        >
                            {enviando ? 'Creando...' : 'Crear usuario'}
                        </button>
                    </form>
                )}
            </div>

            <BottomNav />
        </div>
    )
}

export default Perfil
