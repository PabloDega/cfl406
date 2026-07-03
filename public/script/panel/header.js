console.log("Panel Header script loaded");

// Función para simplificar el header en páginas específicas
function simplificarHeaderEnPaginasEspecificas() {
    const currentPath = window.location.pathname;
    const panelHeader = document.getElementById('panelHeader');
    
    // Páginas donde ocultar la botonera del panel
    const paginasSinBotonera = [
        '/panel/cursos/agregar',
        '/panel/cursos/modificar',
        '/panel/alumnos/agregar',
        '/panel/profesores/agregar'
    ];
    
    // Si estamos en una página específica, ocultar la botonera
    if (paginasSinBotonera.some(pagina => currentPath.startsWith(pagina))) {
        if (panelHeader) {
            // Ocultar solo los botones, mantener el logo
            const botones = panelHeader.querySelectorAll('.btnHeader');
            botones.forEach(boton => {
                boton.style.display = 'none';
            });
            
            // Agregar clase para estilos específicos
            panelHeader.classList.add('header-simplificado');
            
            console.log('Header simplificado aplicado para:', currentPath);
        }
    }
}

document.querySelectorAll('.btnHeader').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        window.location.href = `/panel${target}`; // Redirigir a la página correspondiente
    });
});

// Ejecutar simplificación del header cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', simplificarHeaderEnPaginasEspecificas);