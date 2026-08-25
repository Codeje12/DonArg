import { NavLink } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import MenuPerfil from './MenuPerfil'
import LogoIcon from './LogoIcon'
import Wordmark from './Wordmark'

function enlaceActivo({ isActive }) {
    return isActive
        ? 'text-emerald-700 font-medium'
        : 'text-neutral-600 hover:text-emerald-700'
}

function Header() {
    const { usuarioActual } = useUsuario()

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-neutral-900">
                    <LogoIcon size={26} />
                    <Wordmark />
                </NavLink>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex gap-6 text-sm">
                        <NavLink to="/" end className={enlaceActivo}>Explorar</NavLink>
                    </nav>
                    {usuarioActual ? (
                        <MenuPerfil />
                    ) : (
                        <NavLink to="/login" className={enlaceActivo}>Iniciar sesión</NavLink>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
