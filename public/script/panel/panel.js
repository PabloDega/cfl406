console.log("Panel script loaded");

import { mostrarErrores } from "../mostrarError.js";

document.querySelectorAll('.panelCont').forEach(panel => {
    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

document.querySelectorAll(".acciones > .btn").forEach(accion => {
    accion.addEventListener('click', function(e) {
        e.stopPropagation();
        const accion = this.getAttribute('data-accion');
        const id = this.getAttribute('data-id');
        const url = `/panel/cursos/acciones/${accion}/${id}`;
        console.log(`Redirecting to: ${url}`);
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data received:", data);
            if(data.error){
                mostrarErrores([new Error(data.msg)]);
            }
        })
        .catch(error => {
            mostrarErrores([new Error("Error al realizar la acción")]);
        });
        return false; // Prevent default action
    });
});

document.querySelector("#agregarCurso").addEventListener('click', (e) => {
    e.stopPropagation();
    const url = "/panel/cursos/agregar";
    console.log(`Redirecting to: ${url}`);
    return
    window.location.href = url;
});