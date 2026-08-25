import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verificarEmail } from '../services/usuarioService'

function VerificarEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [estado, setEstado] = useState('cargando')
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        if (!token) {
            setEstado('error')
            setMensaje('Falta el token de verificación en el link.')
            return
        }

        verificarEmail(token)
            .then(() => setEstado('ok'))
            .catch(err => {
                setEstado('error')
                setMensaje(err.response?.data?.message || 'No se pudo verificar el email.')
            })
    }, [token])

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-neutral-200 p-8 text-center space-y-4">
                {estado === 'cargando' && <p className="text-sm text-neutral-500">Verificando tu email...</p>}

                {estado === 'ok' && (
                    <>
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center">
                            <div className="w-5 h-5 rounded bg-emerald-600" />
                        </div>
                        <h1 className="text-xl font-extrabold text-neutral-900">Email verificado</h1>
                        <p className="text-sm text-neutral-500">Ya podés volver a la app.</p>
                        <Link to="/mi-cuenta" className="inline-block mt-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                            Ir a mi perfil
                        </Link>
                    </>
                )}

                {estado === 'error' && (
                    <>
                        <h1 className="text-xl font-extrabold text-neutral-900">No pudimos verificarte</h1>
                        <p className="text-sm text-red-600">{mensaje}</p>
                        <Link to="/mi-cuenta" className="inline-block mt-2 text-sm text-emerald-700 hover:underline">
                            Volver a la app
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default VerificarEmail
