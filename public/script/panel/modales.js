// Funciones de cortina específicas para el panel de administración

let cortina = document.querySelector(".cortina");

export function mostrarCortinaConModal(data, accion, avoid, clase) {
  //console.log(clase)
  let editable = accion === "editar";
  let disableInput = accion === "ver" ? "readonly" : "";
  document.querySelector(".cortina #txt").innerHTML = `<h1>${accion} curso</h1>`
  if (editable) {
    document.querySelector("#btnPopUpCancelar").style.display = "block";
    document.querySelector("#btnPopUpCancelar").dataset.accion = "modificar";
    document.querySelector("#btnPopUpAceptar").dataset.accion = "modificar";
    // Guardar el ID en el botón para poder recuperarlo después
    if (data.id) {
      document.querySelector("#btnPopUpAceptar").dataset.id = data.id;
    }
  }
  cortina.style.display = "flex";
  let modalHTML = `<h2>${data.curso}</h2>`;
  for (let key in data) {
    if (avoid && avoid.includes(key)) continue;
    let tipoDato = clase[key] || "text";
    let valor = data[key];
    // Si el dato es una fecha en formato DD/MM/YYYY cambiar el formato a YYYY-MM-DD
    if (tipoDato === "date" && /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      const [day, month, year] = valor.split("/");
      valor = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    if (editable && tipoDato === "object") {
      if (key === "dias") {
        // crear checklist de lunes a viernes y precargar los valores
        let diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        let checklistHTML = `<div id="${key}">`;
        diasSemana.forEach((dia) => {
          let checked = valor.includes(dia) ? "checked" : "";
          checklistHTML += `<label><input type="checkbox" value="${dia}" ${checked}> ${dia}</label><br>`;
        });
        checklistHTML += `</div>`;
        modalHTML += `<span><strong>${key}:</strong>${checklistHTML}</span>`;
        continue; // saltar al siguiente campo
      }
      if(key === "requisitos"){
        // crear un input para cada requisito en el array
        let requisitosHTML = `<div id="${key}">`;
        valor.forEach((req, index) => {
          requisitosHTML += `<input type="text" id="${key}-${index}" value="${req}">`;
        });
        requisitosHTML += `</div>`;
        modalHTML += `<span><strong>${key}:</strong>${requisitosHTML}</span>`;
        // agregar botón para agregar más requisitos
        modalHTML += `<button type="button" id="agregarRequisito">Agregar requisito</button>`;
        setTimeout(() => {
          document.querySelector("#agregarRequisito").addEventListener("click", () => {
            const requisitosDiv = document.querySelector(`#${key}`);
            const newIndex = requisitosDiv.querySelectorAll("input").length;
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.id = `${key}-${newIndex}`;
            requisitosDiv.appendChild(newInput);
          });
        }, 0);
        continue; // saltar al siguiente campo
      }
    }
    if (!editable && tipoDato === "object") {
      if(key === "requisitos"){
        // mostrar los requisitos como una lista
        let requisitosHTML = `<ul>`;
        valor.forEach((req) => {
          requisitosHTML += `<li>${req}</li>`;
        });
        requisitosHTML += `</ul>`;
        modalHTML += `<span><strong>${key}:</strong>${requisitosHTML}</span>`;
        continue; // saltar al siguiente campo
      }
    }

    if (tipoDato === "string") tipoDato = "text";

    modalHTML += `<span><strong>${key}:</strong><input id="${key}" type="${tipoDato}" value="${valor}" ${disableInput}></span>`;
  }
  document.querySelector(".cortina #modal").innerHTML = modalHTML;
}

export function limpiarCortina() {
  setTimeout(() => {
    document.querySelector(".cortina").style.display = "none";
    document.querySelector(".cortina #txt").innerHTML = "";
    document.querySelector(".cortina #modal").innerHTML = "";
    document.querySelector("#btnPopUpCancelar").style.display = "none";
  }, 500);
}

// Event listener para el botón cancelar del panel
document.querySelector("#btnPopUpCancelar")?.addEventListener("click", (e) => {
  // limpiar los data-atributos de los botones si se cierra el popup con cancelar
  if (e.target.dataset.accion) {
    e.target.removeAttribute("data-accion");
    const btnAceptar = document.querySelector("#btnPopUpAceptar");
    btnAceptar?.removeAttribute("data-accion");
    btnAceptar?.removeAttribute("data-id");
  }
  // limpiar la cortina
  limpiarCortina();
});

// Cerrar modal del panel al hacer clic en el fondo
cortina.addEventListener("click", (e) => {
  // Solo cerrar si se hace clic directamente en la cortina o popupCortina, no en el contenido
  if (e.target.classList.contains("cortina") || e.target.classList.contains("popupCortina") || e.target.classList.contains("popup")) {
    // Limpiar los data-atributos antes de cerrar
    const btnCancelar = document.querySelector("#btnPopUpCancelar");
    const btnAceptar = document.querySelector("#btnPopUpAceptar");
    btnCancelar?.removeAttribute("data-accion");
    btnAceptar?.removeAttribute("data-accion");
    btnAceptar?.removeAttribute("data-id");
    limpiarCortina();
  }
});

// agregar evento a los botones de la cortina
document.querySelectorAll(".cortina .btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // si es el btn con id btnPopUpAceptar y data-accion=modificar no limpiar
    if (e.target.id === "btnPopUpAceptar" && e.target.dataset.accion === "modificar") {
      return e.target.dataset.resp;;
    }
    // limpiar la cortina
    limpiarCortina();
    return e.target.dataset.resp;
  });
});