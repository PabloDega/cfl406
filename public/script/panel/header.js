console.log("Panel Header script loaded");

document.querySelectorAll('.btnHeader').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        document.querySelectorAll('.panelContent').forEach(content => {
            content.style.display = 'none';
        });
        document.querySelector(target).style.display = 'flex';
    });
});