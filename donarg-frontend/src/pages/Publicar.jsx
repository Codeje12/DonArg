import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { obtenerCategorias } from '../services/categoriaService'
import { crearPublicacion, buscarPublicacionPorId, actualizarPublicacion } from '../services/publicacionService'
import { agregarImagen, listarImagenesPorPublicacion, eliminarImagen, obtenerUrlImagen } from '../services/imagenService'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const formInicial = {
    tipoPublicacion: 'DONACION',
    categoriaId: '',
    titulo: '',
    descripcion: '',
    zonaAprox: '',
    condicion: '',
}

const etiquetasTipo = {
    DONACION: 'Donación',
    PEDIDO: 'Pedido',
    ENCONTRADO: 'Objeto encontrado',
}

// PublicacionResponse.condicion viene como etiqueta legible ("Poco uso"), no como el valor crudo
// del enum ("POCO_USO") que espera el <select> y PublicacionActualizacionRequest.
const condicionPorEtiqueta = {
    'Nuevo': 'NUEVO',
    'Poco uso': 'POCO_USO',
    'Usado': 'USADO',
}

const TAMANIO_MAXIMO_MB = 5
const TAMANIO_MAXIMO_BYTES = TAMANIO_MAXIMO_MB * 1024 * 1024

// Mismas reglas que PublicacionRequest/PublicacionActualizacionRequest en el backend, mas las del multipart de /api/imagenes.
function validar(form, imagenes) {
    const errores = {}

    if (!form.categoriaId) {
        errores.categoriaId = 'La categoria es obligatoria'
    }

    if (!form.titulo.trim()) {
        errores.titulo = 'El titulo es obligatorio'
    } else if (form.titulo.length > 150) {
        errores.titulo = 'El titulo no puede superar los 150 caracteres'
    }

    if (form.zonaAprox.length > 120) {
        errores.zonaAprox = 'La zona no puede superar los 120 caracteres'
    }

    imagenes.forEach((archivo, index) => {
        if (!archivo.type.startsWith('image/')) {
            errores[`imagen-${index}`] = 'El archivo debe ser una imagen'
        } else if (archivo.size > TAMANIO_MAXIMO_BYTES) {
            errores[`imagen-${index}`] = `La imagen no puede superar los ${TAMANIO_MAXIMO_MB}MB`
        }
    })

    return errores
}

function formatearTamanio(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function Publicar() {
    const { usuarioActual } = useUsuario()
    const navigate = useNavigate()
    const { id } = useParams()
    const esEdicion = Boolean(id)

    const [categorias, setCategorias] = useState([])
    const [form, setForm] = useState(formInicial)
    const [imagenesExistentes, setImagenesExistentes] = useState([])
    const [imagenes, setImagenes] = useState([])
    const [errores, setErrores] = useState({})
    const [errorGeneral, setErrorGeneral] = useState(null)
    const [enviando, setEnviando] = useState(false)
    const [cargandoPublicacion, setCargandoPublicacion] = useState(esEdicion)
    const [noEditable, setNoEditable] = useState(false)

    useEffect(() => {
        obtenerCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error al traer categorias', error))
    }, [])

    useEffect(() => {
        if (!esEdicion || !usuarioActual) {
            return
        }

        buscarPublicacionPorId(id)
            .then(response => {
                const publicacion = response.data

                if (publicacion.usuarioId !== usuarioActual.id || publicacion.estado !== 'ACTIVA') {
                    setNoEditable(true)
                    return
                }

                setForm({
                    tipoPublicacion: publicacion.tipoPublicacion,
                    categoriaId: String(publicacion.categoriaId),
                    titulo: publicacion.titulo,
                    descripcion: publicacion.descripcion || '',
                    zonaAprox: publicacion.zonaAprox || '',
                    condicion: publicacion.condicion ? condicionPorEtiqueta[publicacion.condicion] : '',
                })

                return listarImagenesPorPublicacion(id).then(res => setImagenesExistentes(res.data))
            })
            .catch(error => console.error('Error al traer la publicacion', error))
            .finally(() => setCargandoPublicacion(false))
    }, [esEdicion, id, usuarioActual])

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSeleccionArchivos(e) {
        const nuevos = Array.from(e.target.files)
        setImagenes([...imagenes, ...nuevos])
        e.target.value = '' // permite volver a elegir el mismo archivo si hace falta
    }

    function quitarImagen(index) {
        setImagenes(imagenes.filter((_, i) => i !== index))
    }

    function quitarImagenExistente(imagenId) {
        eliminarImagen(imagenId)
            .then(() => setImagenesExistentes(prev => prev.filter(img => img.id !== imagenId)))
            .catch(error => console.error('Error al eliminar la imagen', error))
    }

    function handleSubmit(e) {
        e.preventDefault()

        const erroresValidacion = validar(form, imagenes)
        setErrores(erroresValidacion)
        if (Object.keys(erroresValidacion).length > 0) {
            return
        }

        setErrorGeneral(null)
        setEnviando(true)

        const datosComunes = {
            categoriaId: Number(form.categoriaId),
            titulo: form.titulo,
            descripcion: form.descripcion,
            zonaAprox: form.zonaAprox,
            condicion: form.condicion || null,
        }

        const guardar = esEdicion
            ? actualizarPublicacion(id, datosComunes)
            : crearPublicacion({ ...datosComunes, tipoPublicacion: form.tipoPublicacion })

        guardar
            .then(response => {
                if (imagenes.length === 0) {
                    return null
                }
                return Promise.allSettled(
                    imagenes.map(archivo => agregarImagen(response.data.id, archivo))
                )
            })
            .then(resultados => {
                const fallidas = resultados?.filter(r => r.status === 'rejected').length || 0
                if (fallidas > 0) {
                    console.error(`${fallidas} imagen(es) no se pudieron subir`)
                }
                navigate(esEdicion ? '/mis-publicaciones' : '/')
            })
            .catch(err => {
                const data = err.response?.data
                if (data?.errores) {
                    setErrores(data.errores)
                } else {
                    setErrorGeneral(data?.message || 'No se pudo guardar la publicacion')
                }
            })
            .finally(() => setEnviando(false))
    }

    if (!usuarioActual) {
        return (
            <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
                <Header />
                <div className="mx-auto max-w-md px-4 py-8 text-center">
                    <p className="text-sm text-neutral-600">
                        Necesitás crear tu usuario antes de publicar.
                    </p>
                    <Link to="/login" className="inline-block mt-3 text-emerald-700 font-medium text-sm">
                        Iniciá sesión
                    </Link>
                </div>
                <BottomNav />
            </div>
        )
    }

    if (esEdicion && cargandoPublicacion) {
        return (
            <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
                <Header />
                <BottomNav />
            </div>
        )
    }

    if (esEdicion && noEditable) {
        return (
            <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
                <Header />
                <div className="mx-auto max-w-md px-4 py-8 text-center">
                    <p className="text-sm text-neutral-600">
                        Esta publicación no se puede editar (no es tuya, o ya no está activa).
                    </p>
                    <Link to="/mis-publicaciones" className="inline-block mt-3 text-emerald-700 font-medium text-sm">
                        Volver a Mis publicaciones
                    </Link>
                </div>
                <BottomNav />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
            <Header />

            <div className="mx-auto max-w-lg px-4 py-8">
                <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        {esEdicion ? 'Editar publicación' : 'Nueva publicación'}
                    </h2>

                    <div>
                        <label className="text-sm text-neutral-600">Tipo</label>
                        {esEdicion ? (
                            <p className="mt-1 text-sm text-neutral-700">{etiquetasTipo[form.tipoPublicacion]}</p>
                        ) : (
                            <select
                                name="tipoPublicacion"
                                value={form.tipoPublicacion}
                                onChange={handleChange}
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="DONACION">Donación</option>
                                <option value="PEDIDO">Pedido</option>
                                <option value="ENCONTRADO">Objeto encontrado</option>
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="text-sm text-neutral-600">Categoría</label>
                        <select
                            name="categoriaId"
                            value={form.categoriaId}
                            onChange={handleChange}
                            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">Elegí una categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                        {errores.categoriaId && <p className="text-xs text-red-600 mt-1">{errores.categoriaId}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-neutral-600">Título</label>
                        <input
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            maxLength={150}
                            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                        />
                        {errores.titulo && <p className="text-xs text-red-600 mt-1">{errores.titulo}</p>}
                    </div>

                    <div>
                        <label className="text-sm text-neutral-600">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-neutral-600">Zona aproximada</label>
                        <input
                            name="zonaAprox"
                            value={form.zonaAprox}
                            onChange={handleChange}
                            maxLength={120}
                            placeholder="Ej: Villa Sarita, Posadas"
                            className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                        />
                        {errores.zonaAprox && <p className="text-xs text-red-600 mt-1">{errores.zonaAprox}</p>}
                    </div>

                    {form.tipoPublicacion !== 'PEDIDO' && (
                        <div>
                            <label className="text-sm text-neutral-600">Condición</label>
                            <select
                                name="condicion"
                                value={form.condicion}
                                onChange={handleChange}
                                className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Sin especificar</option>
                                <option value="NUEVO">Nuevo</option>
                                <option value="POCO_USO">Poco uso</option>
                                <option value="USADO">Usado</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-sm text-neutral-600">Fotos (opcional)</label>
                        <p className="text-xs text-neutral-400 mt-0.5">
                            Podés elegir varias fotos del mismo objeto (máximo {TAMANIO_MAXIMO_MB}MB cada una).
                        </p>

                        {imagenesExistentes.length > 0 && (
                            <ul className="mt-2 grid grid-cols-3 gap-2">
                                {imagenesExistentes.map(img => (
                                    <li key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                                        <img
                                            src={obtenerUrlImagen(img.nombreArchivo)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => quitarImagenExistente(img.id)}
                                            className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {imagenes.length > 0 && (
                            <ul className="mt-2 space-y-1">
                                {imagenes.map((archivo, index) => (
                                    <li key={`${archivo.name}-${index}`}>
                                        <div className="flex items-center justify-between gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5">
                                            <span className="text-sm text-neutral-700 truncate">{archivo.name}</span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs text-neutral-400">{formatearTamanio(archivo.size)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => quitarImagen(index)}
                                                    className="text-neutral-400 hover:text-red-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                        {errores[`imagen-${index}`] && (
                                            <p className="text-xs text-red-600 mt-1">{errores[`imagen-${index}`]}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <label className="mt-2 inline-block text-sm text-emerald-700 hover:underline cursor-pointer">
                            + Agregar fotos
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleSeleccionArchivos}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {errorGeneral && <p className="text-sm text-red-600">{errorGeneral}</p>}

                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                    >
                        {esEdicion
                            ? (enviando ? 'Guardando...' : 'Guardar cambios')
                            : (enviando ? 'Publicando...' : 'Publicar')}
                    </button>
                </form>
            </div>

            <BottomNav />
        </div>
    )
}

export default Publicar
