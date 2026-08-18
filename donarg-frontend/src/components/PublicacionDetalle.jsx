import { useState, useEffect } from 'react'
import { listarImagenesPorPublicacion } from '../services/imagenService'
import Carrusel from './Carrusel'

function PublicacionDetalle({ publicacion, onVolver }) {
    const [imagenes, setImagenes] = useState([])

    useEffect(() => {
        listarImagenesPorPublicacion(publicacion.id)
            .then(response => setImagenes(response.data))
            .catch(error => console.error('Error al traer imagenes', error))
    }, [publicacion.id])

    return (
        <div className="bg-white md:rounded-xl md:border md:border-neutral-200 min-h-full md:min-h-0">
            {onVolver && (
                <button
                    onClick={onVolver}
                    className="flex items-center gap-2 text-sm text-neutral-600 px-4 py-3 border-b border-neutral-100 w-full"
                >
                    <span>←</span> Publicación
                </button>
            )}

            <div className="p-4">
                <Carrusel imagenes={imagenes} />

                <h2 className="text-lg font-semibold text-neutral-900 mt-4">{publicacion.titulo}</h2>
                <p className="text-sm text-neutral-600 mt-1">{publicacion.descripcion}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        {publicacion.categoriaNombre}
                    </span>
                    {publicacion.condicion && (
                        <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                            {publicacion.condicion}
                        </span>
                    )}
                    <span className="text-xs text-neutral-500 self-center">{publicacion.zonaAprox}</span>
                </div>

                <p className="text-sm text-neutral-500 mt-4">Publicado por {publicacion.usuarioNombre}</p>

                <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg">
                        ♡ Lo quiero
                    </button>
                    <button className="px-3 border border-neutral-200 rounded-lg text-neutral-600">
                        ✉
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PublicacionDetalle
