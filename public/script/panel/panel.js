console.log("Panel script loaded");

import { ABMCursos } from "./cursos.js";

document.querySelectorAll(".panelCont").forEach((panel) => {
  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.querySelectorAll(".acciones > .btn").forEach((accion) => {
  accion.addEventListener("click", async function (e) {
    e.stopPropagation();
    const tabla = this.getAttribute("data-tabla");
    const accion = this.getAttribute("data-accion");
    const id = this.getAttribute("data-id");
    const url = `/panel/${tabla}/${accion}/${id}`;
    console.log(`llamando a: ${url}`);
    if (accion === "eliminar") {
      if (!confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")) {
        return false; // Prevent default action
      }
    }
    const resp = await ABMtabla(accion, url, tabla);
    return false; // Prevent default action
  });
});

document.querySelector("#agregarCurso")?.addEventListener("click", (e) => {
  e.stopPropagation();
  const url = "/panel/cursos/agregar";
  console.log(`Redirecting to: ${url}`);
  window.location.href = url;
});

document.querySelector("#btnPopUpAceptar")?.addEventListener("click", async (e) => {
  if (e.target.dataset.accion) {
    let envio = await enviarFormulario(e.target.dataset.accion);
    if (!envio.error) {
      guardarEnLS("flashMessage", envio.msg);
      window.location.reload();
    } else {
      mostrarError("Error al ejecutar la acción", 1);
      return;
    }
  }
});


async function ABMtabla(accion, url, tabla) {
  if (tabla === "cursos") {
    return await ABMCursos(accion, url);
  }
}