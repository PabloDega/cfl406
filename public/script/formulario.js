console.log("Formulario");

// inicializar formulario en/del localStorage
let formulario = {}

const formularioIniciado = localStorage.getItem("formularioInscripcion") !== null;

if (!formularioIniciado) {
  const inicioDeEvento = new Date().toLocaleString("es-AR")
  formulario = { inicioDeEvento }
  localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
} else {
  formulario = JSON.parse(localStorage.getItem("formularioInscripcion"))
}
//=================================================
// Cargar datos guardados en el formulario

// Activar boton de sede si ya fue seleccionado
if (formulario?.sede) {
  document.querySelectorAll(".btnSedeFormulario").forEach(btn => {
    if (btn.dataset.sedeId === formulario.sede) {
      btn.classList.add("btnFormularioActivo");
    }
  });
  // mostrar paso 2 y el select correspondiente
  document.querySelector("#paso2").classList.remove("oculto");
  document.querySelector(`#selectSede${formulario.sede}`).classList.remove("oculto");
  if(formulario.curso){
    cargarSelectsCursos(formulario.sede, formulario.sedeNombre);
    // seleccionar curso en el select correspondiente
    document.querySelectorAll(".selectCurso select").forEach(select => {
      if (select.value === formulario.curso) {
        select.value = formulario.curso;
      }
    });
  }
}


//====================================
// funciones formulario

// Paso 1: Seleccionar sede
document.querySelectorAll(".btnSedeFormulario").forEach(btn => {
  btn.addEventListener("click", function (e) {
    // quitar clase .btnFormularioActivo de todos los botones
    document.querySelectorAll(".btnSedeFormulario").forEach(btn => {
      btn.classList.remove("btnFormularioActivo");
    });
    // agregar clase .btnFormularioActivo al boton seleccionado
    this.classList.add("btnFormularioActivo");
    // guardar en localStorage
    formulario.sede = this.dataset.sedeId;
    const sedeNombre = this.textContent.trim();
    formulario.sedeNombre = sedeNombre;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
    cargarSelectsCursos(this.dataset.sedeId, sedeNombre);
  });
});

// Paso 2: Seleccionar curso
document.querySelectorAll(".selectCurso select").forEach(select => {
  select.addEventListener("change", function (e) {
    formulario.curso = this.value;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
  });
});

//===================================================
// Utilidades

// Cargar selects de cursos según sede seleccionada
function cargarSelectsCursos(idSede, sedeNombre) {
  // ocultar los 2 .selectCurso aplicandoles clase .oculto
  document.querySelectorAll(".selectCurso").forEach(select => {
    select.classList.add("oculto");
  });
  // mostrar el select correspondiente a la sede seleccionada
  document.querySelector(`#selectSede${idSede}`).classList.remove("oculto");
  // Cargar nombre en <span id="sedeSeleccionada"></span>
  document.querySelector("#sedeSeleccionada").textContent = sedeNombre;
  // resetear select inputs de paso 2
  document.querySelectorAll(".selectCurso select").forEach(select => {
    select.value = "";
  });
  // mostrar paso 2
  document.querySelector("#paso2").classList.remove("oculto");
}

// vaciar formulario
document.querySelector("#vaciarFormulario").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("formularioInscripcion");
  formulario = {};
  document.querySelector("#formularioInscripcion").reset();
  window.location.reload();
});

// Enviar formulario
document.querySelector("#formularioInscripcion").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  console.log("Datos del formulario:", data);
  // Aquí puedes enviar los datos a tu servidor
});

async function enviarFormulario(accion) {
  console.log("enviando formulario para acción:", accion);
  // mostrar cortina de carga

  // recolectar los datos del formulario
  try {
    let data = leerInputs();
    console.log("Datos recolectados:", data);
    // enviar los datos al servidor
    return { error: false, msg: "Accion " + accion + " realizada con éxito" };
  } catch (error) {
    console.error("Error al recolectar los datos del formulario:", error);
    return { error: true, msg: "Error al recolectar los datos del formulario" };
  }
}

function leerInputs() {
  let inputs = document.querySelectorAll(".formulario input");
  let data = {};
  inputs.forEach(input => {
    data[input.id] = input.value;
  });
  return data;
}
