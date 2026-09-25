import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarImagenesPorPublicacion } from '../services/imagenService'
import { marcarInteres, listarInteresesPorPublicacion } from '../services/interesService'
import { listarOfertasPorPublicacion } from '../services/ofertaService'
import { elegirInteresado, cerrarPublicacion, cancelarPublicacion } from '../services/publicacionService'
import { buscarChatPorPublicacion } from '../services/chatService'
import { contarMensajesNoLeidos } from '../services/mensajeService'
import { useUsuario } from '../context/UsuarioContext'
import { estilosEstado, etiquetasEstado } from '../utils/estadoPublicacion'
import Carrusel from './Carrusel'
import ChatPanel from './ChatPanel'
import Modal from './Modal'

function PublicacionDetalle({ publicacion, onVolver, onActualizar }) {
    const [imagenes, setImagenes] = useState([])
    const [interesado, setInteresado] = useState(false)
    const [enviandoInteres, setEnviandoInteres] = useState(false)
    const [errorInteres, setErrorInteres] = useState(null)
    const [chatId, setChatId] = useState(null)
    const [mostrarChat, setMostrarChat] = useState(false)
    const [noLeidos, setNoLeidos] = useState(0)
    const [candidatos, setCandidatos] = useState([])
    const [eligiendoId, setEligiendoId] = useState(null)
    const [errorElegir, setErrorElegir] = useState(null)
    const [cambiandoEstado, setCambiandoEstado] = useState(false)
    const [errorEstado, setErrorEstado] = useState(null)
    const [mostrarConfirmarCancelar, setMostrarConfirmarCancelar] = useState(false)
    const { usuarioActual } = useUsuario()
    const navigate = useNavigate()

    const esDueño = usuarioActual && publicacion.usuarioId === usuarioActual.id
    const esDonacion = publicacion.tipoPublicacion === 'DONACION'
    const esPedido = publicacion.tipoPublicacion === 'PEDIDO'
    const estaActiva = publicacion.estado === 'ACTIVA'
    const esElegido = usuarioActual && publicacion.usuarioElegidoId === usuarioActual.id
    const puedeChatear = usuarioActual
        && (publicacion.estado === 'RESERVADA' || publicacion.estado === 'COMPLETADA')
        && (esDueño || esElegido)
    const puedeElegir = esDueño && estaActiva && (esDonacion || esPedido)

    useEffect(() => {
        listarImagenesPorPublicacion(publicacion.id)
            .then(response => setImagenes(response.data))
            .catch(error => console.error('Error al traer imagenes', error))
    }, [publicacion.id])

    useEffect(() => {
        setInteresado(false)
        setErrorInteres(null)
        if (!usuarioActual || !esDonacion) {
            return
        }
        listarInteresesPorPublicacion(publicacion.id)
            .then(response => {
                const yaMarcado = response.data.some(interes => interes.usuarioId === usuarioActual.id)
                setInteresado(yaMarcado)
            })
            .catch(error => console.error('Error al traer intereses', error))
    }, [publicacion.id, usuarioActual, esDonacion])

    useEffect(() => {
        setChatId(null)
        if (!puedeChatear) {
            return
        }
        buscarChatPorPublicacion(publicacion.id)
            .then(response => setChatId(response.data.id))
            .catch(error => console.error('Error al traer el chat', error))
    }, [publicacion.id, puedeChatear])

    useEffect(() => {
        setNoLeidos(0)
        if (!chatId || mostrarChat) {
            return
        }

        function consultarNoLeidos() {
            contarMensajesNoLeidos(chatId)
                .then(response => setNoLeidos(response.data))
                .catch(error => console.error('Error al contar mensajes no leidos', error))
        }

        consultarNoLeidos()
        const intervalo = setInterval(consultarNoLeidos, 15000)
        return () => clearInterval(intervalo)
    }, [chatId, mostrarChat, usuarioActual])

    useEffect(() => {
        setCandidatos([])
        setErrorElegir(null)
        if (!puedeElegir) {
            return
        }
        const listar = esDonacion ? listarInteresesPorPublicacion : listarOfertasPorPublicacion
        listar(publicacion.id)
            .then(response => setCandidatos(response.data))
            .catch(error => console.error('Error al traer candidatos', error))
    }, [publicacion.id, puedeElegir, esDonacion])

    function handleElegir(usuarioElegidoId) {
        setErrorElegir(null)
        setEligiendoId(usuarioElegidoId)

        elegirInteresado(publicacion.id, usuarioElegidoId)
            .then(response => onActualizar?.(response.data))
            .catch(err => setErrorElegir(err.response?.data?.message || 'No se pudo elegir a este usuario'))
            .finally(() => setEligiendoId(null))
    }

    function handleCerrar() {
        setErrorEstado(null)
        setCambiandoEstado(true)
        cerrarPublicacion(publicacion.id)
            .then(response => onActualizar?.(response.data))
            .catch(err => setErrorEstado(err.response?.data?.message || 'No se pudo marcar como completada'))
            .finally(() => setCambiandoEstado(false))
    }

    function handleCancelar() {
        setErrorEstado(null)
        setCambiandoEstado(true)
        cancelarPublicacion(publicacion.id)
            .then(response => {
                onActualizar?.(response.data)
                setMostrarConfirmarCancelar(false)
            })
            .catch(err => setErrorEstado(err.response?.data?.message || 'No se pudo cancelar la publicación'))
            .finally(() => setCambiandoEstado(false))
    }

    function handleClickInteres() {
        if (!usuarioActual) {
            navigate('/login')
            return
        }

        setErrorInteres(null)
        setEnviandoInteres(true)

        marcarInteres({ publicacionId: publicacion.id })
            .then(() => setInteresado(true))
            .catch(err => {
                if (err.response?.status === 409) {
                    setInteresado(true)
                    return
                }
                setErrorInteres(err.response?.data?.message || 'No se pudo registrar el interés')
            })
            .finally(() => setEnviandoInteres(false))
    }

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
                    {esDueño && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${estilosEstado[publicacion.estado]}`}>
                            {etiquetasEstado[publicacion.estado]}
                        </span>
                    )}
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

                {puedeElegir && (
                    <div className="mt-4 border-t border-neutral-100 pt-3">
                        <h3 className="text-sm font-semibold text-neutral-900">
                            {esDonacion ? 'Interesados' : 'Ofertas'}
                        </h3>
                        {candidatos.length === 0 ? (
                            <p className="text-sm text-neutral-400 mt-1">
                                Todavía nadie {esDonacion ? 'mostró interés' : 'se ofreció'}.
                            </p>
                        ) : (
                            <ul className="mt-2 space-y-2">
                                {candidatos.map(candidato => (
                                    <li
                                        key={candidato.id}
                                        className="flex items-center justify-between gap-2 bg-neutral-50 rounded-lg px-3 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm text-neutral-900 truncate">{candidato.usuarioNombre}</p>
                                            {candidato.mensaje && (
                                                <p className="text-xs text-neutral-500 truncate">{candidato.mensaje}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleElegir(candidato.usuarioId)}
                                            disabled={eligiendoId !== null}
                                            className="shrink-0 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                                        >
                                            {eligiendoId === candidato.usuarioId ? 'Eligiendo...' : 'Elegir'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errorElegir && <p className="text-xs text-red-600 mt-2">{errorElegir}</p>}
                    </div>
                )}

                {esDueño && (publicacion.estado === 'ACTIVA' || publicacion.estado === 'RESERVADA') && (
                    <div className="flex gap-2 mt-4">
                        {publicacion.estado === 'ACTIVA' && (
                            <button
                                onClick={() => navigate(`/publicar/${publicacion.id}`)}
                                className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2 rounded-lg"
                            >
                                ✎ Editar
                            </button>
                        )}
                        {publicacion.estado === 'RESERVADA' && (
                            <button
                                onClick={handleCerrar}
                                disabled={cambiandoEstado}
                                className="flex-1 border border-emerald-600 text-emerald-700 text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                            >
                                Marcar como completada
                            </button>
                        )}
                        <button
                            onClick={() => setMostrarConfirmarCancelar(true)}
                            disabled={cambiandoEstado}
                            className="flex-1 border border-red-200 text-red-600 text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                        >
                            Cancelar publicación
                        </button>
                    </div>
                )}
                {errorEstado && !mostrarConfirmarCancelar && <p className="text-xs text-red-600 mt-2">{errorEstado}</p>}

                <div className="flex gap-2 mt-4">
                    {!esDueño && esDonacion && (
                        <button
                            onClick={handleClickInteres}
                            disabled={enviandoInteres || interesado || !estaActiva}
                            className="flex-1 bg-emerald-600 text-white text-sm font-medium py-2 rounded-lg disabled:opacity-50"
                        >
                            {interesado
                                ? '✓ Ya mostraste interés'
                                : enviandoInteres
                                    ? 'Enviando...'
                                    : estaActiva
                                        ? '♡ Lo quiero'
                                        : 'No disponible'}
                        </button>
                    )}
                    <button
                        onClick={() => setMostrarChat(true)}
                        disabled={!puedeChatear || !chatId}
                        title={!puedeChatear ? 'El chat se habilita cuando el dueño elige a un interesado' : undefined}
                        className={`relative px-3 border border-neutral-200 rounded-lg text-neutral-600 disabled:opacity-40 ${
                            esDueño || !esDonacion ? 'flex-1' : ''
                        }`}
                    >
                        ✉
                        {noLeidos > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] leading-none rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                                {noLeidos}
                            </span>
                        )}
                    </button>
                </div>

                {errorInteres && <p className="text-xs text-red-600 mt-2">{errorInteres}</p>}
            </div>

            {mostrarChat && chatId && (
                <ChatPanel
                    chatId={chatId}
                    usuarioActual={usuarioActual}
                    onCerrar={() => setMostrarChat(false)}
                    onLeido={() => setNoLeidos(0)}
                />
            )}

            {mostrarConfirmarCancelar && (
                <Modal titulo="Cancelar publicación" onCerrar={() => setMostrarConfirmarCancelar(false)}>
                    <p className="text-sm text-neutral-600">
                        ¿Seguro que querés cancelar esta publicación? No se puede deshacer.
                    </p>
                    {errorEstado && <p className="text-xs text-red-600 mt-3">{errorEstado}</p>}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmarCancelar(false)}
                            className="px-4 py-2 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:border-neutral-400"
                        >
                            Volver
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelar}
                            disabled={cambiandoEstado}
                            className="flex-1 bg-red-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {cambiandoEstado ? 'Cancelando...' : 'Sí, cancelar publicación'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default PublicacionDetalle
