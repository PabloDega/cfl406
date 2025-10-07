// cortina
export function mostrarCortinaConMsg(txt, btncancelar) {
    let cortina = document.querySelector(".cortina");
    cortina.style.display = "flex";

    if (btncancelar) {
        document.querySelector("#btnPopUpCancelar").style.display = "block";
    }

    document.querySelector(".cortina #txt").innerHTML = txt;
}

export function mostrarCortinaConModal(modalHtml, btncancelar) {
    let cortina = document.querySelector(".cortina");
    cortina.style.display = "flex";
    if (btncancelar) {
        document.querySelector("#btnPopUpCancelar").style.display = "block";
    }
    document.querySelector(".cortina #txt").innerHTML = modalHtml;
}

// agregar evento a los botones de la cortina

document.querySelectorAll(".cortina .btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        cortina.style.display = "none";
        document.querySelector(".cortina #txt").innerHTML = "";
        document.querySelector("#btnPopUpCancelar").style.display = "none";
        return e.target.dataset.resp;
    });
});

document.querySelector(".popup").addEventListener("click", (e) => {
    if (e.target.classList.contains("popup")) {
        cortina.style.display = "none";
        document.querySelector(".cortina #txt").innerHTML = "";
        document.querySelector("#btnPopUpCancelar").style.display = "none";
    }
});
