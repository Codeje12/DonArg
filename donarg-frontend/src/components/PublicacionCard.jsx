import { useState, useEffect } from 'react'
import { listarImagenesPorPublicacion, obtenerUrlImagen } from '../services/imagenService'
import ImagenPlaceholder from './ImagenPlaceholder'

function PublicacionCard({ publicacion, onClick }) {
    const [imagenes, setImagenes] = useState([])

    useEffect(() => {
        listarImagenesPorPublicacion(publicacion.id)
            .then(response => setImagenes(response.data))
            .catch(error => console.error('Error al traer imagenes', error))
    }, [publicacion.id])

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="aspect-4/3">
                {imagenes.length > 0 ? (
                    <img
                        src={obtenerUrlImagen(imagenes[0].nombreArchivo)}
                        alt={publicacion.titulo}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <ImagenPlaceholder className="w-16 h-16" />
                )}
            </div>
            <div className="p-4">
                <h3 className="font-medium text-neutral-900 text-base truncate">{publicacion.titulo}</h3>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-neutral-500 truncate">{publicacion.zonaAprox}</span>
                    <span className="shrink-0 ml-2 text-sm bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                        {publicacion.categoriaNombre}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PublicacionCard
