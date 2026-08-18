import { NavLink } from 'react-router-dom'

function enlaceActivo({ isActive }) {
    return isActive
        ? 'text-emerald-700 font-medium'
        : 'text-neutral-600 hover:text-emerald-700'
}

function Header() {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                <NavLink to="/" className="text-xl font-bold text-emerald-700">
                    Donar
                </NavLink>
                <nav className="hidden md:flex gap-6 text-sm">
                    <NavLink to="/" end className={enlaceActivo}>Feed</NavLink>
                    <NavLink to="/publicar" className={enlaceActivo}>Publicar</NavLink>
                    <span className="text-neutral-300 cursor-not-allowed">Mensajes</span>
                    <NavLink to="/perfil" className={enlaceActivo}>Perfil</NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header
