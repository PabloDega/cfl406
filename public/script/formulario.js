console.log("Formulario");

document.querySelector("#formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Datos del formulario:", data);
    // Aquí puedes enviar los datos a tu servidor
});

export async function enviarFormulario(accion) {
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
