console.log("Inscripción");

let botonesInscripcion = document?.querySelectorAll(".btnInscripcion");

if(botonesInscripcion.length > 0) {
    botonesInscripcion.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let url = `https://docs.google.com/forms/d/e/1FAIpQLSeDtWdZ7PGhTg74Vuj-oUQ-OoXZ94S9j8kFRl0118UfCJRF_g/viewform?pli=1`
            /* let url = "/formulario";
            if (e.target.dataset.id) {
                url += `?curso=${e.target.dataset.id}`;
            } */
            window.location.href = url;
        });
    });
}