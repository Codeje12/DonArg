// Helice de 4 hojas del sistema de identidad de DonArg (dos que dan, dos que reciben).
// variante "negativo" es para fondos oscuros (paneles verdes, footer).
function LogoIcon({ size = 28, variante = 'color', className = '' }) {
    const colores = variante === 'negativo'
        ? { principal: '#FFFFFF', secundario: '#9BD3AF' }
        : { principal: '#2F7D4F', secundario: '#8FC7A4' }

    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <path d="M32 32C33 19 42 11 55 10C54 23 45 31 32 32Z" fill={colores.principal} />
            <path d="M32 32C31 45 22 53 9 54C10 41 19 33 32 32Z" fill={colores.principal} />
            <path d="M32 32C19 31 11 22 10 9C23 10 31 19 32 32Z" fill={colores.secundario} />
            <path d="M32 32C45 33 53 42 54 55C41 54 33 45 32 32Z" fill={colores.secundario} />
        </svg>
    )
}

export default LogoIcon
