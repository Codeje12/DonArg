import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { obtenerMisPublicaciones } from '../services/publicacionService'
import { etiquetasEstado } from '../utils/estadoPublicacion'
import { marcarInteresesRevisados } from '../utils/notificaciones'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import PublicacionCard from '../components/PublicacionCard'
import PublicacionDetalle from '../components/PublicacionDetalle'

const filtros = [null, 'ACTIVA', 'RESERVADA', 'COMPLETADA', 'CANCELADA']

function MisPublicaciones() {
    const { usuarioActual, cargando } = useUsuario()
    const [publicaciones, setPublicaciones] = useState([])
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null)

    useEffect(() => {
        if (!usuarioActual) {
            return
        }
        obtenerMisPublicaciones(usuarioActual.id)
            .then(response => setPublicaciones(response.data.content))
            .catch(error => console.error('Error al traer mis publicaciones', error))

        marcarInteresesRevisados(usuarioActual.id)
    }, [usuarioActual])

    function handlePublicacionActualizada(publicacionActualizada) {
        setPublicacionSeleccionada(publicacionActualizada)
        setPublicaciones(prev => prev.map(pub => pub.id === publicacionActualizada.id ? publicacionActualizada : pub))
    }

    const publicacionesFiltradas = estadoSeleccionado
        ? publicaciones.filter(pub => pub.estado === estadoSeleccionado)
        : publicaciones

    if (cargando) {
        return null
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
            <Header />

            <div className="mx-auto max-w-7xl px-4 py-4 md:flex md:gap-8">
                <main className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-lg font-semibold text-neutral-900">Mis publicaciones</h1>
                        {usuarioActual && (
                            <Link
                                to="/publicar"
                                className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700"
                            >
                                <span className="text-base leading-none">+</span> Crear publicación
                            </Link>
                        )}
                    </div>

                    {!usuarioActual ? (
                        <p className="text-sm text-neutral-500 mt-4">
                            Necesitás crear tu usuario en <span className="font-medium">Perfil</span> para ver tus publicaciones.
                        </p>
                    ) : (
                        <>
                            <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0">
                                {filtros.map(estado => (
                                    <button
                                        key={estado ?? 'todas'}
                                        onClick={() => setEstadoSeleccionado(estado)}
                                        className={`shrink-0 px-3 py-1.5 rounded-full text-sm ${
                                            estadoSeleccionado === estado
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-white border border-neutral-200 text-neutral-600'
                                        }`}
                                    >
                                        {estado ? etiquetasEstado[estado] : 'Todas'}
                                    </button>
                                ))}
                            </div>

                            {publicacionesFiltradas.length === 0 ? (
                                <p className="text-sm text-neutral-500 mt-4">
                                    No tenés publicaciones para mostrar acá.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {publicacionesFiltradas.map(pub => (
                                        <PublicacionCard
                                            key={pub.id}
                                            publicacion={pub}
                                            mostrarEstado
                                            onClick={() => setPublicacionSeleccionada(pub)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>

                <aside className="hidden md:block w-80 shrink-0 self-start sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    {publicacionSeleccionada ? (
                        <PublicacionDetalle
                            publicacion={publicacionSeleccionada}
                            onActualizar={handlePublicacionActualizada}
                        />
                    ) : (
                        <div className="text-sm text-neutral-400 border border-dashed border-neutral-200 rounded-xl p-6 text-center">
                            Seleccioná una publicación para ver el detalle
                        </div>
                    )}
                </aside>
            </div>

            {publicacionSeleccionada && (
                <div className="md:hidden fixed inset-0 z-20 bg-white overflow-y-auto">
                    <PublicacionDetalle
                        publicacion={publicacionSeleccionada}
                        onVolver={() => setPublicacionSeleccionada(null)}
                        onActualizar={handlePublicacionActualizada}
                    />
                </div>
            )}

            {!publicacionSeleccionada && <BottomNav />}
        </div>
    )
}

export default MisPublicaciones
