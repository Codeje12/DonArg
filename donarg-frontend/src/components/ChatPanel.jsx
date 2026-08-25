import { useState, useEffect, useRef } from 'react'
import { listarMensajesPorChat, enviarMensaje, marcarMensajesLeidos } from '../services/mensajeService'

function ChatPanel({ chatId, usuarioActual, onCerrar, onLeido }) {
    const [mensajes, setMensajes] = useState([])
    const [texto, setTexto] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState(null)
    const finRef = useRef(null)

    useEffect(() => {
        listarMensajesPorChat(chatId)
            .then(response => setMensajes(response.data))
            .catch(err => console.error('Error al traer mensajes', err))

        marcarMensajesLeidos(chatId)
            .then(() => onLeido?.())
            .catch(err => console.error('Error al marcar mensajes como leidos', err))
    }, [chatId])

    useEffect(() => {
        finRef.current?.scrollIntoView({ block: 'nearest' })
    }, [mensajes])

    function handleSubmit(e) {
        e.preventDefault()
        const contenido = texto.trim()
        if (!contenido) {
            return
        }

        setError(null)
        setEnviando(true)

        enviarMensaje({ chatId, contenido })
            .then(response => {
                setMensajes(prev => [...prev, response.data])
                setTexto('')
            })
            .catch(err => setError(err.response?.data?.message || 'No se pudo enviar el mensaje'))
            .finally(() => setEnviando(false))
    }

    return (
        <div className="fixed inset-0 z-30 bg-black/50 flex items-end md:items-center justify-center">
            <div className="bg-white w-full md:max-w-md md:rounded-xl flex flex-col h-full md:h-[32rem]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                    <h3 className="text-sm font-semibold text-neutral-900">Mensajes</h3>
                    <button onClick={onCerrar} className="text-neutral-500 text-sm">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                    {mensajes.length === 0 ? (
                        <p className="text-sm text-neutral-400 text-center mt-6">Todavía no hay mensajes.</p>
                    ) : (
                        mensajes.map(mensaje => {
                            const esPropio = mensaje.usuarioId === usuarioActual.id
                            return (
                                <div key={mensaje.id} className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                        esPropio ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-800'
                                    }`}>
                                        {!esPropio && (
                                            <p className="text-xs font-medium mb-0.5 opacity-70">{mensaje.usuarioNombre}</p>
                                        )}
                                        <p>{mensaje.contenido}</p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={finRef} />
                </div>

                {error && <p className="text-xs text-red-600 px-4 pb-1">{error}</p>}

                <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-neutral-100">
                    <input
                        value={texto}
                        onChange={e => setTexto(e.target.value)}
                        placeholder="Escribí un mensaje..."
                        className="flex-1 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={enviando || !texto.trim()}
                        className="bg-emerald-600 text-white text-sm font-medium px-4 rounded-lg disabled:opacity-50"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChatPanel
