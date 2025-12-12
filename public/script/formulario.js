console.log("Formulario");

// Variable global para almacenar las localidades
let localidadesData = {};

// Inicializar los datos de localidades al cargar la página
(async () => {
  try {
    const response = await fetch("./data/localidades.json");
    localidadesData = await response.json();
  } catch (error) {
    console.error("Error al cargar localidades:", error);
  }
})();

let provincias;

// Función para completar el select de provincias
function completarSelectProvincias() {
  const provinciaSelect = document.querySelector("#provincia");
  if (provinciaSelect) {
    // primer opcion <option value="0">Seleccione una provincia</option>
    const defaultOption = document.createElement("option");
    defaultOption.value = "0";
    defaultOption.textContent = "Seleccione una provincia";
    defaultOption.selected = true;
    provinciaSelect.appendChild(defaultOption);
    provincias.forEach((provincia) => {
      const option = document.createElement("option");
      option.value = provincia.id;
      option.textContent = provincia.provincia;
      provinciaSelect.appendChild(option);
    });
    console.log("Select de provincias completado");
    
    // Si hay un formulario guardado con provincia, seleccionarla automáticamente
    if (formulario && formulario["provincia"]) {
      provinciaSelect.value = formulario["provincia"];
      // Cargar localidades manteniendo la localidad guardada
      cargarLocalidades(formulario["provincia"], true);
    }
  }
}

// Inicializar los datos de provincias al cargar la página
(async () => {
  try {
    const response = await fetch("./data/provincias.json");
    provincias = await response.json();
    completarSelectProvincias();
  } catch (error) {
    console.error("Error al cargar provincias:", error);
  }
})();

// deshabilitad funcional y visualmente el boton de enviar formulario
document.querySelector("#btnEnviarFormulario").classList.add("btnDisabled");

// completar select de cursos con window.cursos
document.querySelectorAll(".select.selectCursoSede").forEach((select) => {
  // obtener sedeId del select
  const sedeId = select.dataset.sedeId;
  // filtrar solo cursos con inscripcion true
  const cursosFiltrados = window.cursos.filter((curso) => curso.inscripcion && curso.sedeId.toString() === sedeId);
  // agregar opciones al select
  cursosFiltrados.forEach((curso) => {
    const option = document.createElement("option");
    option.value = curso.id;
    option.textContent = `${curso.curso}`;
    select.appendChild(option);
  });
});

//===============================================
// Formulario de inscripción

// inicializar formulario en/del localStorage
let formulario = {
  completo: false,
};

const formularioIniciado = localStorage.getItem("formularioInscripcion") !== null;

if (!formularioIniciado) {
  const inicioDeEvento = new Date().toLocaleString("es-AR");
  formulario = { inicioDeEvento };
  localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
} else {
  formulario = JSON.parse(localStorage.getItem("formularioInscripcion"));
}

//=================================================
// Cargar datos preguardados en el formulario

// Activar boton de sede si ya fue seleccionado
if (formulario?.sede) {
  document.querySelectorAll(".btnSedeFormulario").forEach((btn) => {
    if (btn.dataset.sedeId === formulario.sede) {
      btn.classList.add("btnFormularioActivo");
    }
  });
  // mostrar paso 2 y el select correspondiente
  document.querySelector("#paso2").classList.remove("oculto");
  document.querySelector(`#selectSede${formulario.sede}`).classList.remove("oculto");
  mostrarPaso2(formulario.sede, formulario.sedeNombre);
  if (formulario.curso) {
    mostrarDetallesCurso(formulario.curso);
    console.log("Cargando curso preseleccionado:", formulario.curso);
    // seleccionar curso en el select correspondiente
    const selectCurso = document.querySelector(`#selectSede${formulario.sede} select`);
    if (selectCurso) {
      selectCurso.value = formulario.curso;
      selectCurso.dispatchEvent(new Event("change"));
    }
    mostrarPaso3();
    // cargar datos personales
    document.querySelectorAll("#paso3 .formItems input").forEach((input) => {
      if (formulario[input.name]) {
        input.value = formulario[input.name];
        // disparar evento input para actualizar el formulario
        input.dispatchEvent(new Event("input"));
      }
    });
    // La selección de provincia y localidad ahora se maneja automáticamente 
    // en la función completarSelectProvincias() cuando termina de cargar
  }

}

//====================================
// funciones formulario

// Paso 1: Seleccionar sede
document.querySelectorAll(".btnSedeFormulario").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // quitar clase .btnFormularioActivo de todos los botones
    document.querySelectorAll(".btnSedeFormulario").forEach((btn) => {
      btn.classList.remove("btnFormularioActivo");
    });
    // agregar clase .btnFormularioActivo al boton seleccionado
    this.classList.add("btnFormularioActivo");
    // guardar en localStorage
    formulario.sede = this.dataset.sedeId;
    const sedeNombre = this.textContent.trim();
    formulario.sedeNombre = sedeNombre;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
    borrarPasosPosteriores(1);
    mostrarPaso2(this.dataset.sedeId, sedeNombre);
  });
});

// Paso 2: Seleccionar curso
document.querySelectorAll(".selectCurso select").forEach((select) => {
  select.addEventListener("change", function (e) {
    if (this.value === "0") {
      borrarPasosPosteriores(2);
      borrarDetallesCurso();
      // eliminar curso del formulario
      delete formulario.curso;
      localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
      return; // no hacer nada si no se seleccionó un curso válido
    }
    formulario.curso = this.value;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
    mostrarDetallesCurso(this.value);
    mostrarPaso3();
  });
});

// paso 3: completar datos personales
document.querySelectorAll("#paso3 .formItems input, #paso3 .formItems select").forEach((input) => {
  // Para inputs usar 'input', para selects usar 'change'
  const eventType = input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
  
  input.addEventListener(eventType, function (e) {
    if (this.value === "") {
      // eliminar del formulario
      delete formulario[this.name];
      localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
      checkPaso3(); // Verificar si el formulario sigue completo
      return; // no hacer nada si el campo está vacío
    }
    formulario[this.name] = this.value;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
    checkPaso3();
  });
});

// habilitar select de localidad si la provincia seleccionada es 1 o 2
document.querySelector("#provincia").addEventListener("change", function (e) {
  cargarLocalidades(this.value);
});

// Paso 4 - afiliacion
document.querySelector("#afiliacion").addEventListener("change", function (e) {
  if (this.value === "0") {
    // deshabilitar input inferior y vaciar su valor
    document.querySelector("#empresa").classList.add("oculto");
    document.querySelector("#empresa").value = "";
    // eliminar del formulario
    delete formulario.afiliacion;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
    checkPaso3();
    return; // no hacer nada si no se seleccionó una afiliación válida
  } else if (this.value === "true") {
    // habilitar input inferior
    document.querySelector("#empresa").classList.remove("oculto");
  } else {
    // deshabilitar input inferior y vaciar su valor
    document.querySelector("#empresa").classList.add("oculto");
    document.querySelector("#empresa").value = "";
  }
  formulario.afiliacion = this.value;
  localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
  checkPaso3();
});

//===================================================
// Utilidades

// Cargar selects de cursos según sede seleccionada
function mostrarPaso2(idSede, sedeNombre) {
  // ocultar los 2 .selectCurso aplicandoles clase .oculto
  document.querySelectorAll(".selectCurso").forEach((select) => {
    select.classList.add("oculto");
  });
  // mostrar el select correspondiente a la sede seleccionada
  document.querySelector(`#selectSede${idSede}`).classList.remove("oculto");
  // Cargar nombre en <span id="sedeSeleccionada"></span>
  document.querySelector("#sedeSeleccionada").textContent = sedeNombre;
  // resetear select inputs de paso 2
  document.querySelectorAll(".selectCurso select").forEach((select) => {
    select.value = "0";
  });
  // mostrar paso 2
  document.querySelector("#paso2").classList.remove("oculto");
}

// Mostrar paso 3
function mostrarPaso3() {
  document.querySelector("#paso3").classList.remove("oculto");
  checkPaso3();
}

// mostrar paso 4
function mostrarPaso4() {
  document.querySelector("#paso4").classList.remove("oculto");
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
document.querySelector("#btnEnviarFormulario").addEventListener("click", async (e) => {
  console.log("Enviar formulario");
  if(!formulario.completo){
    alert("Complete todos los pasos del formulario antes de enviarlo.");
    return;
  }
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  // Aquí puedes enviar los datos a tu servidor
  let resp = await fetch("/formulario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!resp.ok) {
    alert("Error al enviar el formulario: " + resp.statusText);
    return { error: true, msg: "Error al enviar el formulario" };
  }

  resp = await resp.json();
  return { error: false, msg: "Formulario enviado con éxito" };
} );



/* async function btnEnviarFormulario(accion) {
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
} */

function leerInputs() {
  let inputs = document.querySelectorAll(".formulario input");
  let data = {};
  inputs.forEach((input) => {
    data[input.id] = input.value;
  });
  return data;
}

// Borrar pasos posteriores al indicado
function borrarPasosPosteriores(paso) {
  if (paso < 2) {
    delete formulario.curso;
    borrarDetallesCurso();
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
    // ocultar pasos posteriores al indicado
    document.querySelector("#paso2").classList.add("oculto");
    document.querySelectorAll(".selectCurso").forEach((select) => {
      // seleccionar valor 0 en el select
      select.value = "0";
      select.classList.add("oculto");
    });
  }
  if (paso < 3) {
    document.querySelector("#paso3").classList.add("oculto");
    document.querySelector("#paso4").classList.add("oculto");
  }
}

function cargarLocalidades(provinciaId, mantenerLocalidadGuardada = false) {
  const localidadGuardada = formulario.localidad;
  
  // Solo vaciar propiedad localidad del formulario si no estamos restaurando
  if (!mantenerLocalidadGuardada) {
    delete formulario.localidad;
    localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
  }
  
  const localidadSelect = document.querySelector("#localidad");
  // limpiar opciones actuales
  localidadSelect.innerHTML = '<option value="0" selected>Seleccione una localidad</option>';
  if (provinciaId === "1" || provinciaId === "2") {
    // cargar localidades según provinciaId
    let localidades;
    if (provinciaId === "1") {
      localidades = localidadesData.GBA || [];
    } else if (provinciaId === "2") {
      localidades = localidadesData.CABA || [];
    } else {
      localidades = [];
    }
    // agregar opciones al select de localidades
    if (localidades && localidades.length > 0) {
      localidades.forEach((localidad) => {
        const option = document.createElement("option");
        option.value = localidad.id;
        option.textContent = localidad.nombre;
        localidadSelect.appendChild(option);
      });
      localidadSelect.disabled = false;
      
      // Si estamos manteniendo la localidad guardada, restaurarla
      if (mantenerLocalidadGuardada && localidadGuardada) {
        localidadSelect.value = localidadGuardada;
        // Restaurar en el formulario también
        formulario.localidad = localidadGuardada;
        localStorage.setItem("formularioInscripcion", JSON.stringify(formulario));
      }
    }
  } else {
    localidadSelect.disabled = true;
    localidadSelect.value = "0";
  }
}

// Verificar paso 3 completo para mostrar en 4to paso
function checkPaso3() {
  const inputsPaso3 = document.querySelectorAll("#paso3 .formItems input, #paso3 .formItems select#provincia");
  let completo = true;

  inputsPaso3.forEach((input) => {
    if (input.value === "" || input.value == 0) {
      completo = false;
    }
  });
  console.log("Paso 3 completo:", completo);
  if(completo){
    mostrarPaso4();
    return true
  } else {
    document.querySelector("#paso4").classList.add("oculto");
    return false;
  }
}

function mostrarDetallesCurso(cursoId) {
  const detallesCurso = document.querySelector("#formDetallesCurso");
  const curso = window.cursos.find(curso => curso.id.toString() === cursoId.toString());
  if (curso) {
    document.querySelector("#areaCurso").textContent = curso.area;
    document.querySelector("#inicioCurso").textContent = curso.inicio;
    document.querySelector("#finCurso").textContent = curso.fin;
    document.querySelector("#diaHorarioCurso").textContent = curso.dias.join(" y ") + " de " + curso.horario;
    detallesCurso.classList.remove("oculto");
  } else {
    console.log("Curso no encontrado");
  }
}

function borrarDetallesCurso() {
  const detallesCurso = document.querySelector("#formDetallesCurso");
  document.querySelector("#areaCurso").textContent = "";
  document.querySelector("#inicioCurso").textContent = "";
  document.querySelector("#finCurso").textContent = "";
  document.querySelector("#diaHorarioCurso").textContent = "";
  detallesCurso.classList.add("oculto");
}