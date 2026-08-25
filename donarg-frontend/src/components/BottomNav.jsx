import { NavLink } from 'react-router-dom'

const items = [
    { label: 'Inicio', icon: '⌂', to: '/' },
    { label: 'Buscar', icon: '⌕', to: null },
    { label: 'Publicar', icon: '+', to: '/publicar' },
    { label: 'Mensajes', icon: '✉', to: '/mensajes' },
    { label: 'Perfil', icon: '☺', to: '/mi-cuenta' },
]

function BottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 flex justify-around py-2">
            {items.map(item =>
                item.to ? (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 px-2 ${
                                isActive ? 'text-emerald-700' : 'text-neutral-500'
                            }`
                        }
                    >
                        <span className="text-lg leading-none">{item.icon}</span>
                        <span className="text-[10px]">{item.label}</span>
                    </NavLink>
                ) : (
                    <button
                        key={item.label}
                        disabled
                        className="flex flex-col items-center gap-0.5 px-2 text-neutral-300"
                    >
                        <span className="text-lg leading-none">{item.icon}</span>
                        <span className="text-[10px]">{item.label}</span>
                    </button>
                )
            )}
        </nav>
    )
}

export default BottomNav
