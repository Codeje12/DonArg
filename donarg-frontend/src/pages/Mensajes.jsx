import { useState, useEffect } from 'react'
import { useUsuario } from '../context/UsuarioContext'
import { listarMisChats } from '../services/chatService'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import ChatPanel from '../components/ChatPanel'

function Mensajes() {
    const { usuarioActual, cargando } = useUsuario()
    const [chats, setChats] = useState([])
    const [chatAbierto, setChatAbierto] = useState(null)

    useEffect(() => {
        if (!usuarioActual) {
            return
        }

        function cargarChats() {
            listarMisChats()
                .then(response => setChats(response.data))
                .catch(error => console.error('Error al traer los chats', error))
        }

        cargarChats()
        const intervalo = setInterval(cargarChats, 15000)
        return () => clearInterval(intervalo)
    }, [usuarioActual])

    function handleCerrarChat() {
        setChatAbierto(null)
        listarMisChats(usuarioActual.id)
            .then(response => setChats(response.data))
            .catch(error => console.error('Error al traer los chats', error))
    }

    if (cargando) {
        return null
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-16 md:pb-0">
            <Header />

            <div className="mx-auto max-w-2xl px-4 py-6">
                <h1 className="text-lg font-semibold text-neutral-900 mb-4">Mensajes</h1>

                {!usuarioActual ? (
                    <p className="text-sm text-neutral-500">
                        Necesitás crear tu usuario en <span className="font-medium">Perfil</span> para ver tus mensajes.
                    </p>
                ) : chats.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                        Todavía no tenés chats. Se abren cuando elegís a un interesado en tu publicación, o cuando te eligen a vos.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {chats.map(chat => (
                            <li key={chat.id}>
                                <button
                                    onClick={() => setChatAbierto(chat.id)}
                                    className="w-full flex items-center justify-between gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 text-left"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-neutral-900 truncate">{chat.otroUsuarioNombre}</p>
                                        <p className="text-xs text-neutral-500 truncate">{chat.publicacionTitulo}</p>
                                        {chat.ultimoMensaje && (
                                            <p className="text-xs text-neutral-400 truncate mt-0.5">{chat.ultimoMensaje}</p>
                                        )}
                                    </div>
                                    {chat.noLeidos > 0 && (
                                        <span className="shrink-0 bg-red-600 text-white text-[10px] leading-none rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                            {chat.noLeidos}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {chatAbierto && (
                <ChatPanel
                    chatId={chatAbierto}
                    usuarioActual={usuarioActual}
                    onCerrar={handleCerrarChat}
                    onLeido={() => setChats(prev => prev.map(c => c.id === chatAbierto ? { ...c, noLeidos: 0 } : c))}
                />
            )}

            <BottomNav />
        </div>
    )
}

export default Mensajes
