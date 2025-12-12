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
  let editable = accion === "modificar";
  let disableInput = accion === "ver" ? "readonly" : "";
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
    let tipoDato = "text";
    let valor = data[key];
    let checked = "";
    // Si el dato es una fecha en formato DD/MM/YYYY, cambiar el input a type="date"
    if (editable) {
      tipoDato = clase[key] || "text";
      if(tipoDato === "string" || tipoDato === "object") tipoDato = "text";
      // Si el dato es una fecha en formato DD/MM/YYYY cambiar el formato a YYYY-MM-DD
      if (tipoDato === "date" && /^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
        const [day, month, year] = valor.split("/");
        valor = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      if(tipoDato === "boolean") {
        tipoDato = "checkbox";
        valor = "true";
        checked = data[key] ? "checked" : "";
      }
    }
    modalHTML += `<span><strong>${key}:</strong><input id="${key}" type="${tipoDato}" value="${valor}" ${checked} ${disableInput}></span>`;
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
      const btnAceptar = document.querySelector("#btnPopUpAceptar");
      btnAceptar.removeAttribute("data-accion");
      btnAceptar.removeAttribute("data-id");
    }
    // limpiar la cortina
    limpiarCortina();
    return e.target.dataset.resp;
  });
});

// Cerrar modal solo si se hace clic en el fondo (cortina)
cortina.addEventListener("click", (e) => {
  // Solo cerrar si se hace clic directamente en la cortina o popupCortina, no en el contenido
  if (e.target.classList.contains("cortina") || e.target.classList.contains("popupCortina")) {
    limpiarCortina();
  }
});

// Prevenir que clics dentro del popup cierren el modal
document.querySelector(".popup > span").addEventListener("click", (e) => {
  e.stopPropagation();
});

export function limpiarCortina() {
  setTimeout(() => {
    document.querySelector(".cortina").style.display = "none";
    document.querySelector(".cortina #txt").innerHTML = "";
    document.querySelector(".cortina #modal").innerHTML = "";
    document.querySelector("#btnPopUpCancelar").style.display = "none";
  }, 500);
}