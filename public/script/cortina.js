let cortina = document.querySelector(".cortina");

// capturar el evento wheel sobre la cortina para evitar el scroll del fondo, pero permitirlo en el modal
cortina.addEventListener("wheel", (e) => {
    const modal = document.querySelector(".cortina #modal");
    if (modal && modal.contains(e.target)) {
        // Permitir el scroll dentro del modal
        return;
    }
    e.preventDefault();
    e.stopPropagation();
}, { passive: false });

// cortina
export function mostrarCortinaConMsg(txt, btncancelar) {
    cortina.style.display = "flex";
    if (btncancelar) {
        document.querySelector("#btnPopUpCancelar").style.display = "block";
    }
    document.querySelector(".cortina #txt").innerHTML = txt;
}

export function mostrarCortinaConModal(data, accion, avoid) {
    let editable = accion === "editar";
    let disableInput = accion === "ver" ? "readonly" : "";
    if (editable) {
        document.querySelector("#btnPopUpCancelar").style.display = "block";
    }
    cortina.style.display = "flex";
    let modalHTML = `<h2>${data.curso}</h2>`;
    for (let key in data) {
        if(avoid && avoid.includes(key)) continue;
        modalHTML += `<span><strong>${key}:</strong><input id="${key}" type="text" value="${data[key]}" ${disableInput}></span>`;
    }
    document.querySelector(".cortina #modal").innerHTML = modalHTML;
}

// agregar evento a los botones de la cortina

document.querySelectorAll(".cortina .btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
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
