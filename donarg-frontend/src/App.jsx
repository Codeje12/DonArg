import { Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed'
import Publicar from './pages/Publicar'
import Perfil from './pages/Perfil'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/publicar" element={<Publicar />} />
            <Route path="/perfil" element={<Perfil />} />
        </Routes>
    )
}

export default App
