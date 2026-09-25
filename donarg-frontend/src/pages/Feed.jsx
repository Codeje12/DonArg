import { useState, useEffect, useRef } from 'react'
import { useUsuario } from '../context/UsuarioContext'
import { obtenerPublicaciones } from '../services/publicacionService'
import { obtenerCategorias } from '../services/categoriaService'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import PublicacionCard from '../components/PublicacionCard'
import PublicacionDetalle from '../components/PublicacionDetalle'

const TAMANIO_PAGINA = 10

function Feed() {
    const { usuarioActual } = useUsuario()
    const [publicaciones, setPublicaciones] = useState([])
    const [categorias, setCategorias] = useState([])
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null)
    const [pagina, setPagina] = useState(0)
    const [hayMas, setHayMas] = useState(true)
    const [cargandoMas, setCargandoMas] = useState(false)
    const sentinelaRef = useRef(null)

    useEffect(() => {
        obtenerCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error al traer categorias', error))
    }, [])

    const usuarioActualId = usuarioActual?.id

    // Al cambiar de categoria (o de usuario logueado) arrancamos de nuevo desde la primera pagina.
    useEffect(() => {
        setPublicaciones([])
        setPagina(0)
        setHayMas(true)
    }, [categoriaSeleccionada, usuarioActualId])

    useEffect(() => {
        setCargandoMas(true)
        obtenerPublicaciones(categoriaSeleccionada, pagina, TAMANIO_PAGINA, usuarioActualId)
            .then(response => {
                const { content, last } = response.data
                setPublicaciones(prev => (pagina === 0 ? content : [...prev, ...content]))
                setHayMas(!last)
            })
            .catch(error => console.error('Error al traer publicaciones', error))
            .finally(() => setCargandoMas(false))
    }, [categoriaSeleccionada, pagina, usuarioActualId])

    useEffect(() => {
        const nodo = sentinelaRef.current
        if (!nodo) {
            return
        }

        const observer = new IntersectionObserver(entradas => {
            if (entradas[0].isIntersecting && hayMas && !cargandoMas) {
                setPagina(p => p + 1)
            }
        }, { rootMargin: '300px' })

        observer.observe(nodo)
        return () => observer.disconnect()
    }, [hayMas, cargandoMas])

    function esActiva(categoriaId) {
        return categoriaSeleccionada === categoriaId
    }

    function handlePublicacionActualizada(publicacionActualizada) {
        setPublicacionSeleccionada(publicacionActualizada)
        setPublicaciones(prev => prev.map(pub => pub.id === publicacionActualizada.id ? publicacionActualizada : pub))
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

                    {publicaciones.length === 0 && !cargandoMas ? (
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

                    <div ref={sentinelaRef} />
                    {cargandoMas && (
                        <p className="text-sm text-neutral-400 text-center mt-6">Cargando más publicaciones...</p>
                    )}
                </main>

                {/* Panel de detalle: solo en desktop, al lado del feed. Sticky para que no se pierda de vista al scrollear la lista. */}
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

            {/* En mobile el detalle se abre a pantalla completa, tapando el feed */}
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

export default Feed
