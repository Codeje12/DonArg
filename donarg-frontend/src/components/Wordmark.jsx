// "don" hereda el color del texto de alrededor (blanco en paneles oscuros, oscuro en fondos claros);
// "ARG" siempre lleva el verde de marca. variante "negativo" ajusta el verde para que se lea bien
// sobre los paneles oscuros (mismo criterio que LogoIcon).
function Wordmark({ variante = 'color', className = '' }) {
    const acento = variante === 'negativo' ? 'text-emerald-300' : 'text-emerald-600'
    return (
        <span className={className}>
            don<span className={acento}>ARG</span>
        </span>
    )
}

export default Wordmark
