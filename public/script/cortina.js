import { mostrarError, mostrarInfo, guardarEnLS } from "./mostrar.js";

let cortina = document.querySelector(".cortina");

// capturar el evento wheel sobre la cortina para evitar el scroll del fondo, pero permitirlo en el modal
cortina.addEventListener("wheel",  (e) => {
    const modal = document.querySelector(".cortina #modal");
    if (modal && modal.contains(e.target)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  },
  { passive: false }
);

// cortina
export function mostrarCortinaConMsg(txt, btncancelar) {
  cortina.style.display = "flex";
  if (btncancelar) {
    document.querySelector("#btnPopUpCancelar").style.display = "block";
  }
  document.querySelector(".cortina #txt").innerHTML = txt;
}

export function mostrarCortinaConModal(data, accion, avoid, clase) {
  console.log(clase)
  let editable = accion === "editar";
  let disableInput = accion === "ver" ? "readonly" : "";
  if (editable) {
    document.querySelector("#btnPopUpCancelar").style.display = "block";
    document.querySelector("#btnPopUpCancelar").dataset.accion = "modificar";
    document.querySelector("#btnPopUpAceptar").dataset.accion = "modificar";
  }
  cortina.style.display = "flex";
  let modalHTML = `<h2>${data.curso}</h2>`;
  for (let key in data) {
    if (avoid && avoid.includes(key)) continue;
    let tipoDato = "text";
    let valor = data[key];
    // Si el dato es una fecha en formato DD/MM/YYYY, cambiar el input a type="date"
    if (editable) {
      tipoDato = clase[key] || "text";
      if(tipoDato === "string" || tipoDato === "object") tipoDato = "text";
      // Si el dato es una fecha en formato DD/MM/YYYY cambiar el formato a YYYY-MM-DD
      if (tipoDato === "date" && /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
        const [day, month, year] = valor.split("/");
        valor = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }
    modalHTML += `<span><strong>${key}:</strong><input id="${key}" type="${tipoDato}" value="${valor}" ${disableInput}></span>`;
  }
  document.querySelector(".cortina #modal").innerHTML = modalHTML;
}

// agregar evento a los botones de la cortina

document.querySelectorAll(".cortina .btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    /* if( e.target.id === "btnPopUpAceptar" && e.target.dataset.accion) {
      let envio = await enviarFormulario(e.target.dataset.accion);
      if(!envio.error) {
        guardarEnLS("flashMessage", envio.msg);
        window.location.reload();
      } else {
        mostrarError("Error al ejecutar la acción", 1);
        return;
      }
    } */

    // limpiar los data-atributos de los botones si se cierra el popup con cancelar
    if( e.target.id === "btnPopUpCancelar" && e.target.dataset.accion) {
      e.target.removeAttribute("data-accion");
      document.querySelector("#btnPopUpAceptar").removeAttribute("data-accion");
    }
    // limpiar la cortina
    cortina.style.display = "none";
    document.querySelector(".cortina #txt").innerHTML = "";
    document.querySelector(".cortina #modal").innerHTML = "";
    document.querySelector("#btnPopUpCancelar").style.display = "none";
    return e.target.dataset.resp;
  });
});

document.querySelector(".popup").addEventListener("click", (e) => {
  if (e.target.classList.contains("popup")) {
    cortina.style.display = "none";
    document.querySelector(".cortina #txt").innerHTML = "";
    document.querySelector(".cortina #modal").innerHTML = "";
    document.querySelector("#btnPopUpCancelar").style.display = "none";
  }
});