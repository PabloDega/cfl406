console.log("landing")

let cursos = [
    {
        curso: "Programación Web",
        codigo: 123,
        id: 1,
        activo: true,
        area: "Informática",
        sede: "San Martín",
        año: 2025,
        inicio: "30/03/2025",
        cierreInscripciones: "30/03/2025",
        duracion: "Cuatrimestral",
        titulo: "Oficial",
        tipo: "Presencial",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo", "txtxtx"]
    },{
        curso: "Electricidad Básica",
        codigo: 124,
        id: 2,
        area: "Informática",
        activo: true,
        sede: "San Martín",
        año: 2025,
        inicio: "20/03/2025",
        cierreInscripciones: "20/03/2025",
        duracion: "Cuatrimestral",
        titulo: "Oficial",
        tipo: "Presencial",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo"]
    },{
        curso: "Excel",
        codigo: 125,
        id: 3,
        activo: true,
        area: "Informática",
        sede: "San Miguel",
        año: 2025,
        inicio: "11/05/2025",
        cierreInscripciones: "11/05/2025",
        duracion: "Bimestral",
        titulo: "CFL406",
        tipo: "Online",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo"]
    },{
        curso: "Manicuría",
        codigo: 126,
        activo: true,
        id: 4,
        area: "Estética",
        sede: "San Martín",
        año: 2025,
        inicio: "08/08/2025",
        cierreInscripciones: "08/08/2025",
        duracion: "Cuatrimestral",
        titulo: "Oficial",
        tipo: "Presencial",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo"]
    },{
        curso: "Peinados",
        codigo: 127,
        activo: true,
        id: 5,
        area: "Estética",
        sede: "San Martín",
        año: 2025,
        inicio: "09/04/2025",
        cierreInscripciones: "09/04/2025",
        duracion: "Cuatrimestral",
        titulo: "Oficial",
        tipo: "Presencial",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo"]
    },{
        curso: "Maquillaje Porfesional",
        codigo: 128,
        activo: true,
        id: 6,
        area: "Estética",
        sede: "San Martín",
        año: 2025,
        inicio: "12/05/2025",
        cierreInscripciones: "12/05/2025",
        duracion: "Cuatrimestral",
        titulo: "Oficial",
        tipo: "Semi presencial",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo"]
    },{
        curso: "Maquillaje Porfesional",
        codigo: 128,
        activo: true,
        id: 6,
        area: "Estética",
        sede: "San Miguel",
        año: 2025,
        inicio: "12/09/2025",
        cierreInscripciones: "12/09/2025",
        duracion: "Cuatrimestral",
        titulo: "Oficial",
        tipo: "Semi presencial",
        requisitos: ["Ser Mayor de 18 años", "Presentar DNI vigente", "Presentar titulo de primario completo"]
    }
];

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
    let txtHTML = ""
    cursos.forEach((curso) => {
        if(!curso.activo){return}
        let estado = {
            visibilidad: "",
            estado: "✔ Inscripciones abiertas",
        }
        let visibilidad = "";
        let cierreInscripciones = curso.cierreInscripciones.split("/")
        cierreInscripciones = new Date(cierreInscripciones[2], cierreInscripciones[1]-1, cierreInscripciones[0])
        if(cierreInscripciones < new Date()){
            estado.visibilidad = "oculto";
            estado.estado = "X Inscripciones cerradas"
        }
        txtHTML += `<div class="card flexV">
                        <h2>Sede ${curso.sede}</h2>
                        <h1>${curso.curso}</h1>
                        <span>✔ Curso ${curso.tipo}</span>
                        <span>✔ Titulo ${curso.titulo}</span>
                        <span>${estado.estado}</span>
                        <div class="flexH">
                        <div class="btn btnInscripcion ${estado.visibilidad}" data-id="${curso.id}">Inscripción</div>
                        <div class="btn btnNaranja btnRequisitos" data-id="${curso.id}">Requisitos</div>
                        </div>
                    </div>`
    });
    document.querySelector(".landOferta").innerHTML = txtHTML;
}

renderCursos();

document.querySelectorAll(".btnRequisitos").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let curso = cursos.find((curso) => curso.id == e.target.dataset.id);
        console.log(curso.requisitos);
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
    mostrarCortina(txt, false)
}

// cortina
function mostrarCortina(txt, btncancelar){
    let resp = true;
    let cortina = document.querySelector(".cortina");
    cortina.style.display = "flex";
    if(btncancelar){
        document.querySelector("#btnCancelar").style.display = "block";
    }
    document.querySelector(".cortina #txt").innerHTML = txt;

    document.querySelectorAll(".cortina .btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log(e.target.dataset.resp)
        })
    })
}