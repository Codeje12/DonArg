import { Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed'
import Publicar from './pages/Publicar'
import Mensajes from './pages/Mensajes'
import MisPublicaciones from './pages/MisPublicaciones'
import Registro from './pages/Registro'
import VerificarEmail from './pages/VerificarEmail'
import Login from './pages/Login'
import MiCuenta from './pages/MiCuenta'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/publicar" element={<Publicar />} />
            <Route path="/publicar/:id" element={<Publicar />} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-email" element={<VerificarEmail />} />
            <Route path="/login" element={<Login />} />
            {/* todavia sin linkear desde ningun lado a proposito, solo para poder verla en /mi-cuenta */}
            <Route path="/mi-cuenta" element={<MiCuenta />} />
        </Routes>
    )
}

export default App
