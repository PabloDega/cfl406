console.log("Panel Header script loaded");

// Función para simplificar el header en páginas específicas
function simplificarHeaderEnPaginasEspecificas() {
    const currentPath = window.location.pathname;
    const panelHeader = document.getElementById('panelHeader');
    
    // Páginas donde ocultar la botonera del panel
    const paginasSinBotonera = [
        '/panel/cursos/agregar',
        '/panel/cursos/editar',
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
        document.querySelectorAll('.panelContent').forEach(content => {
            content.style.display = 'none';
        });
        const targetElement = document.querySelector(target);
        if (targetElement) {
            targetElement.style.display = 'flex';
            // guardar en LS la ubicacion actual del panel
            localStorage.setItem('panelActive', target);
        }
    });
});

// al cargar la pagina, mostrar el panel guardado en LS
window.addEventListener('load', () => {
    // Solo ejecutar en la página principal del panel, no en subpáginas como agregar-curso
    const currentPath = window.location.pathname;
    
    // Solo aplicar localStorage en /panel (página principal)
    if (currentPath === '/panel') {
        const panelActive = localStorage.getItem('panelActive');
        if (panelActive) {
            document.querySelectorAll('.panelContent').forEach(content => {
                content.style.display = 'none';
            });
            const targetElement = document.querySelector(panelActive);
            if (targetElement) {
                targetElement.style.display = 'flex';
            }
        }
    }
});

// Ejecutar simplificación del header cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', simplificarHeaderEnPaginasEspecificas);