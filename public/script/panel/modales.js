// Funciones de cortina específicas para el panel de administración

let cortina = document.querySelector(".cortina");

export function mostrarCortinaConModal(data, accion, avoid, clase) {
  //console.log(clase)
  let editable = accion === "modificar";
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
    console.log({key, tipoDato, valor});
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
        modalHTML += `<div type="button" class="btn" id="agregarRequisito">Agregar requisito</div>`;
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
      if(key === "temario"){
        console.log(valor);
        // crear un input para cada tema en el array, mínimo 10 inputs
        let temarioHTML = `<div id="${key}">`;
        const minInputs = 10;
        const totalInputs = Math.max(valor.length, minInputs);
        
        for (let i = 0; i < totalInputs; i++) {
          const temaValue = valor[i] || "";
          temarioHTML += `<input type="text" id="${key}-${i}" value="${temaValue}">`;
        }
        temarioHTML += `</div>`;
        modalHTML += `<span><strong>${key}:</strong>${temarioHTML}</span>`;
        // agregar botón para agregar más temas
        modalHTML += `<div type="button" class="btn" id="agregarTema">Agregar tema</div>`;
        setTimeout(() => {
          document.querySelector("#agregarTema").addEventListener("click", () => {
            const temarioDiv = document.querySelector(`#${key}`);
            const newIndex = temarioDiv.querySelectorAll("input").length;
            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.id = `${key}-${newIndex}`;
            temarioDiv.appendChild(newInput);
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
      if(key === "temario"){
        // mostrar el temario como una lista
        let temarioHTML = `<ul>`;
        valor.forEach((punto) => {
          temarioHTML += `<li>${punto}</li>`;
        });
        temarioHTML += `</ul>`;
        modalHTML += `<span><strong>${key}:</strong>${temarioHTML}</span>`;
        continue; // saltar al siguiente campo
      }
      if(key === "dias"){
        // mostrar los dias como una lista
        let diasHTML = `<ul>`;
        valor.forEach((dia) => {
          diasHTML += `<li>${dia}</li>`;
        });
        diasHTML += `</ul>`;
        modalHTML += `<span><strong>${key}:</strong>${diasHTML}</span>`;
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
    if(e.target.classList.contains("no-cerrar")) return; // si tiene la clase no-cerrar no cerrar{
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