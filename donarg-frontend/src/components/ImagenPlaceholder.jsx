function ImagenPlaceholder({ className = 'w-16 h-16' }) {
    return (
        <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 8.25V15A2.25 2.25 0 005.25 17.25h13.5A2.25 2.25 0 0021 15V8.25M3 8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25M3 8.25l7.5-4.5 7.5 4.5" />
            </svg>
        </div>
    )
}

export default ImagenPlaceholder
