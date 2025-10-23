console.log("Panel Header script loaded");

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