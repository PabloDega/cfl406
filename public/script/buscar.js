console.log("buscar");

import { mostrarError } from "./mostrarError.js";

export const buscar = (query) => {
    try {
        if (!query || typeof query !== 'string') {
            throw new Error("Consulta inválida");
        }
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) {
            throw new Error("La búsqueda no puede estar vacía");
        }
        // Simulate a search operation
        const resultados = window.cursos.filter(curso =>
            Object.values(curso).some(valor =>
                typeof valor === 'string' && valor.toLowerCase().includes(trimmedQuery.toLowerCase())
            )
        );
        return resultados.length > 0 ? resultados : "No se encontraron resultados";
        // Here you would typically make an API call or search through a dataset
    } catch (error) {
        mostrarError(error);
        console.error("Error al buscar:", error.message);
    }
};

export const mostrarResultados = (resultados) => {
    const contenedorResultados = document.querySelector("#resultados");
    contenedorResultados.style.display = "block";
    contenedorResultados.innerHTML = ""; // Limpiar resultados previos
    if (Array.isArray(resultados) && resultados.length > 0) {
        resultados.forEach(resultado => {
            const divResultado = document.createElement("div");
            divResultado.className = "resultado";
            divResultado.dataset.cursoId = resultado.id;
            divResultado.innerHTML = `<h4>${resultado.curso}</h4><p>${resultado.sede}</p>`;
            contenedorResultados.appendChild(divResultado);
        });
        document.querySelectorAll(".resultado").forEach(div => {
            div.addEventListener("click", (e) => {
                const cursoId = e.currentTarget.dataset.cursoId;
                const card = document.querySelector(`#cardCurso-${cursoId}`);
                if (card) {
                    const y = card.getBoundingClientRect().top + window.pageYOffset - 200;
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
                document.querySelector(`#cardCurso-${cursoId}`).classList.add("cardSeleccionado");
                setTimeout(() => {document.querySelector(`#cardCurso-${cursoId}`).classList.remove("cardSeleccionado");}, 6000);
                contenedorResultados.style.display = "none";
            });
        });
    } else {
        contenedorResultados.innerHTML = "<p>No se encontraron resultados.</p>";
    }
}   