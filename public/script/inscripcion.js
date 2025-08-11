console.log("Inscripción");

let botonesInscripcion = document?.querySelectorAll(".btnInscripcion");

if(botonesInscripcion.length > 0) {
    botonesInscripcion.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let url = "/formulario";
            if (e.target.dataset.id) {
                url += `?curso=${e.target.dataset.id}`;
            }
            window.location.href = url;
        });
    });
}