import { useState, useEffect } from 'react'
import { obtenerPublicaciones } from '../services/publicacionService'
import { obtenerCategorias } from '../services/categoriaService'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import PublicacionCard from '../components/PublicacionCard'
import PublicacionDetalle from '../components/PublicacionDetalle'

function Feed() {
    const [publicaciones, setPublicaciones] = useState([])
    const [categorias, setCategorias] = useState([])
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null)

    useEffect(() => {
        obtenerCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error al traer categorias', error))
    }, [])

    useEffect(() => {
        obtenerPublicaciones(categoriaSeleccionada)
            .then(response => setPublicaciones(response.data))
            .catch(error => console.error('Error al traer publicaciones', error))
    }, [categoriaSeleccionada])

    function esActiva(categoriaId) {
        return categoriaSeleccionada === categoriaId
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
            <Header />

            <div className="mx-auto max-w-7xl px-4 py-4 md:flex md:gap-8">
                {/* Categorías: sidebar en desktop */}
                <aside className="hidden md:block w-48 shrink-0">
                    <ul className="space-y-1 text-sm">
                        <li>
                            <button
                                onClick={() => setCategoriaSeleccionada(null)}
                                className={`w-full text-left px-2 py-1.5 rounded-md ${
                                    esActiva(null)
                                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                            >
                                Todos
                            </button>
                        </li>
                        {categorias.map(cat => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => setCategoriaSeleccionada(cat.id)}
                                    className={`w-full text-left px-2 py-1.5 rounded-md ${
                                        esActiva(cat.id)
                                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                    }`}
                                >
                                    {cat.nombre}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="flex-1 min-w-0">
                    {/* Categorías: tabs horizontales en mobile */}
                    <div className="md:hidden flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
                        <button
                            onClick={() => setCategoriaSeleccionada(null)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-sm ${
                                esActiva(null)
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-neutral-200 text-neutral-600'
                            }`}
                        >
                            Todos
                        </button>
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategoriaSeleccionada(cat.id)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-sm ${
                                    esActiva(cat.id)
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-white border border-neutral-200 text-neutral-600'
                                }`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>

                    {publicaciones.length === 0 ? (
                        <p className="text-sm text-neutral-500 mt-4">
                            No hay publicaciones para mostrar.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {publicaciones.map(pub => (
                                <PublicacionCard
                                    key={pub.id}
                                    publicacion={pub}
                                    onClick={() => setPublicacionSeleccionada(pub)}
                                />
                            ))}
                        </div>
                    )}
                </main>

                {/* Panel de detalle: solo en desktop, al lado del feed */}
                <aside className="hidden md:block w-80 shrink-0">
                    {publicacionSeleccionada ? (
                        <PublicacionDetalle publicacion={publicacionSeleccionada} />
                    ) : (
                        <div className="text-sm text-neutral-400 border border-dashed border-neutral-200 rounded-xl p-6 text-center">
                            Seleccioná una publicación para ver el detalle
                        </div>
                    )}
                </aside>
            </div>

            {/* En mobile el detalle se abre a pantalla completa, tapando el feed */}
            {publicacionSeleccionada && (
                <div className="md:hidden fixed inset-0 z-20 bg-white overflow-y-auto">
                    <PublicacionDetalle
                        publicacion={publicacionSeleccionada}
                        onVolver={() => setPublicacionSeleccionada(null)}
                    />
                </div>
            )}

            {!publicacionSeleccionada && <BottomNav />}
        </div>
    )
}

export default Feed
