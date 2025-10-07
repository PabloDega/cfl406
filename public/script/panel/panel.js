console.log("Panel script loaded");

import { mostrarErrores } from "../mostrarError.js";

import { mostrarCortinaConModal } from "../cortina.js";

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
        console.log(`Redirigiendo a: ${url}`);

        if(accion === "eliminar"){
            if(!confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")){
                return false; // Prevent default action
            }
        }
        
        fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            //console.log("Data received:", data);
            if(data.error){
                mostrarErrores([new Error(data.msg)]);
            } else if(accion === "ver" || accion === "editar"){
                // Aquí puedes manejar la visualización o edición del curso
                console.log("Curso data:", data.data);
                // Por ejemplo, podrías abrir un modal con la información del curso
                mostrarCortinaConModal(data.data, accion, ['id', 'activo', 'idProfesor', 'inscripcion']);
            } else if(accion === "inscribir"){
                if(data.redirect){
                    window.location.href = data.redirect;
                } else {
                    mostrarErrores([new Error("Redirección no proporcionada para la inscripción")]);
                }
            } else {
                // Para otras acciones, recargar la página para reflejar los cambios
                window.location.reload();
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