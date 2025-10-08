console.log("Panel script loaded");

import { getClase, ABMCursos } from "./cursos.js";

window.claseCursos = await getClase();

document.querySelectorAll(".panelCont").forEach((panel) => {
    panel.addEventListener("click", (e) => {
        e.stopPropagation();
    });
});

document.querySelectorAll(".acciones > .btn").forEach((accion) => {
    accion.addEventListener("click", async function (e) {
        e.stopPropagation();
        const accion = this.getAttribute("data-accion");
        const id = this.getAttribute("data-id");
        const url = `/panel/cursos/acciones/${accion}/${id}`;
        console.log(`llamando a: ${url}`);
        if (accion === "eliminar") {
            if (!confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")) {
                return false; // Prevent default action
            }
        }
        await ABMCursos(accion, url);
        return false; // Prevent default action
    });
});

document.querySelector("#agregarCurso").addEventListener("click", (e) => {
    e.stopPropagation();
    const url = "/panel/cursos/agregar";
    console.log(`Redirecting to: ${url}`);
    return;
    window.location.href = url;
});
