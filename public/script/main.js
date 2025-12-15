console.log("main")

// Ocultar loading screen cuando todo esté cargado
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Eliminar el elemento del DOM después de la transición
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
});