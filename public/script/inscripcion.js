console.log("Inscripción");

let botonesInscripcion = document?.querySelectorAll(".btnInscripcion");

if(botonesInscripcion.length > 0) {
    botonesInscripcion.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let url = "/inscripcion";
            if (e.target.dataset.id) {
                url += `?curso=${e.target.dataset.id}`;
            }
            console.log("Redirigiendo a:", url);
            return
            window.location.href = url;
        });
    });
}