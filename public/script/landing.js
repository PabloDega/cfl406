console.log("landing")

import { mostrarCortinaConMsg } from "./cortina.js";

// Mapa de Google
let mapas = [{
    sede: "San Martin",
    mapa: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6570.102401229726!2d-58.537018!3d-34.577571!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb777ac83ac91%3A0xc57d993939145bf0!2sCentro%20de%20Formaci%C3%B3n%20Laboral%20N%C2%BA406!5e0!3m2!1ses-419!2sar!4v1743792581181!5m2!1ses-419!2sar" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
}, {
    sede: "San Miguel",
    mapa: `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6572.515327612917!2d-58.709722424514034!3d-34.54703098383787!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbd7a86dae955%3A0xce85502980cfdc78!2sCFL%20N%C2%BA406%20San%20Miguel!5e0!3m2!1ses-419!2sar!4v1743793117240!5m2!1ses-419!2sar" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
}];

let mapaLoad = 0;

// Cursos ----------------------------
function renderCursos(){
    if(!window.cursos || window.cursos.length == 0){
        mostrarCortinaConMsg("No hay cursos disponibles", true);
        return;
    }
    let txtHTML = ""
    window.cursos.forEach((curso) => {
        if(!curso.activo){return}
        let estado = {
            visibilidad: "",
            estado: "✔ Inscripciones abiertas",
        }
        let cierreInscripciones = curso.cierreInscripciones.split("/")
        cierreInscripciones = new Date(cierreInscripciones[2], cierreInscripciones[1]-1, cierreInscripciones[0])
        if(cierreInscripciones < new Date()){
            estado.visibilidad = "oculto";
            estado.estado = "X Inscripciones cerradas";
        }
        txtHTML += `<div class="card flexV" data-id="${curso.id}" id="cardCurso-${curso.id}">
                        <h2>Sede ${curso.sede}</h2>
                        <h1>${curso.curso}</h1>
                        <span>✔ Curso ${curso.tipo}</span>
                        <span>✔ Titulo ${curso.titulo}</span>
                        <span>${estado.estado}</span>
                        <div class="flexH">
                        <div class="btn btnInscripcion ${estado.visibilidad}" data-id="${curso.id}" data-curso="${curso.curso}">Inscripción</div>
                        <div class="btn btnNaranja btnRequisitos" data-id="${curso.id}">Requisitos</div>
                        </div>
                    </div>`;
    });
    document.querySelector(".landOferta").innerHTML = txtHTML;
}

renderCursos();

document.querySelectorAll(".btnRequisitos").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let curso = cursos.find((curso) => curso.id == e.target.dataset.id);
        mostrarRequisitos(curso.requisitos);
    })
})

// Mapas ----------------------------
document.querySelectorAll(".mapa").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        cambiarMapa(e);
    })
})

function cambiarMapa(e){
    if(e.target.dataset.id == mapaLoad){return}
    document.querySelector("#landMapaIF").innerHTML = mapas[e.target.dataset.id].mapa;
    mapaLoad = e.target.dataset.id;
}

// requisitos

function mostrarRequisitos(requisitos){
    let txt = "<ul>";
    requisitos.forEach((dato) => {
        txt += `<li>${dato}</li>`
    })
    txt += "</ul>"
    mostrarCortinaConMsg(txt, false)
}