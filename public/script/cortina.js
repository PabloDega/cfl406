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

// Función para mostrar mensajes simples en la cortina (usado en landing y páginas públicas)
export function mostrarCortinaConMsg(txt, btncancelar) {
  cortina.style.display = "flex";
  if (btncancelar) {
    document.querySelector("#btnPopUpCancelar").style.display = "block";
  }
  document.querySelector(".cortina #txt").innerHTML = txt;
}

// Función para limpiar y ocultar la cortina
function limpiarCortina() {
  setTimeout(() => {
    document.querySelector(".cortina").style.display = "none";
    document.querySelector(".cortina #txt").innerHTML = "";
    document.querySelector(".cortina #modal").innerHTML = "";
    document.querySelector("#btnPopUpCancelar").style.display = "none";
  }, 500);
}

// agregar evento a los botones de la cortina
document.querySelectorAll(".cortina .btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
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