console.log("Panel Header script loaded");

document.querySelectorAll('.btnHeader').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        document.querySelectorAll('.panelContent').forEach(content => {
            content.style.display = 'none';
        });
        document.querySelector(target).style.display = 'flex';
        // guardar en LS la ubicacion actual del panel
        localStorage.setItem('panelActive', target);
    });
});

// al cargar la pagina, mostrar el panel guardado en LS
window.addEventListener('load', () => {
    const panelActive = localStorage.getItem('panelActive');
    if (panelActive) {
        document.querySelectorAll('.panelContent').forEach(content => {
            content.style.display = 'none';
        });
        document.querySelector(panelActive).style.display = 'flex';
    }
});