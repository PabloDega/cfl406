console.log("Panel script loaded");

import { ABMCursos } from "./cursos.js";
import { postAgregarCurso } from "./agregar-curso.js";
import { guardarEnLS, mostrarError } from "../mostrar.js";
import { limpiarCortina } from "./modales.js";

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
  window.location.href = url;
});

document.querySelector("#btnPopUpAceptar")?.addEventListener("click", async (e) => {
  if (e.target.dataset.accion === "modificar") {
    e.stopPropagation(); // Prevenir que otros event listeners se ejecuten
    // leer todos los inputs del modal
    let data = {};
    document.querySelectorAll("#modal input").forEach((input) => {
      data[input.id] = input.value;
      if( input.type === "checkbox" ) {
        data[input.id] = input.checked;
      }
    });

    // capturar los checkbox de dias y reemplazar el objeto data.dias por un array con los dias seleccionados
    const diasSeleccionados = [];
    document.querySelectorAll("#modal #dias input[type='checkbox']").forEach((checkbox) => {
      if (checkbox.checked) {
        diasSeleccionados.push(checkbox.value);
      }
    });
    data.dias = diasSeleccionados;

    // capturar los input de requisitos y convertirlos en un array
    const requisitos = [];
    document.querySelectorAll("#modal #requisitos input[type='text']").forEach((input) => {
      // si el array.value no está vacío agregarlo al array
      if (input.value.trim() !== ""){
        requisitos.push(input.value);
      }
    });
    data.requisitos = requisitos;

    // capturar los input de temario y convertirlos en un array
    const temario = [];
    document.querySelectorAll("#modal #temario input[type='text']").forEach((input) => {
      // si el array.value no está vacío agregarlo al array
      if (input.value.trim() !== ""){
        temario.push(input.value);
      }
    });
    data.temario = temario;

    // Capturar el ID del dataset del botón
    if (e.target.dataset.id) {
      data.id = parseInt(e.target.dataset.id);
    }
    
    console.log("Datos para modificar curso (con ID):", data);

    // Llamar a postAgregarCurso con acción 'update'
    let envio = await postAgregarCurso(data, 'update');
    console.log('Resultado de postAgregarCurso:', envio);
    
    if (!envio.error) {
      // Limpiar el modal manualmente después de éxito
      limpiarCortina();
      guardarEnLS("flashMessage", envio.msg);
      window.location.reload();
    } else {
      mostrarError(new Error("No se pudo modificar el curso: " + envio.msg), 5);
      return;
    }
  }
});

async function ABMtabla(accion, url, tabla) {
  if (tabla === "cursos") {
    return await ABMCursos(accion, url);
  }
}

document.querySelector(".popup").classList.add("no-cerrar");