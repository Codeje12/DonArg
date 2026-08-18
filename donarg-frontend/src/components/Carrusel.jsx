import { useState, useEffect } from 'react'
import { obtenerUrlImagen } from '../services/imagenService'
import ImagenPlaceholder from './ImagenPlaceholder'

function Carrusel({ imagenes }) {
    const [indice, setIndice] = useState(0)

    useEffect(() => {
        setIndice(0)
    }, [imagenes])

    if (imagenes.length === 0) {
        return (
            <div className="aspect-4/3 rounded-lg overflow-hidden">
                <ImagenPlaceholder className="w-12 h-12" />
            </div>
        )
    }

    function anterior() {
        setIndice(i => (i === 0 ? imagenes.length - 1 : i - 1))
    }

    function siguiente() {
        setIndice(i => (i === imagenes.length - 1 ? 0 : i + 1))
    }

    return (
        <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-neutral-100">
            <img
                src={obtenerUrlImagen(imagenes[indice].nombreArchivo)}
                alt=""
                className="w-full h-full object-cover"
            />

            {imagenes.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={anterior}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-neutral-700 shadow"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={siguiente}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-neutral-700 shadow"
                    >
                        ›
                    </button>
                    <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
                        {imagenes.map((_, i) => (
                            <span
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${i === indice ? 'bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Carrusel
