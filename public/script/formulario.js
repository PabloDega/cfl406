console.log("Formulario");

document.querySelector("#formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Datos del formulario:", data);
    // Aquí puedes enviar los datos a tu servidor
});
