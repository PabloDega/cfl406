console.log("buscar");

import { mostrarErrores } from "./mostrar.js";

export const buscar = (query) => {
    try {
        if (!query || typeof query !== 'string') {
            throw new Error("Consulta inválida");
        }
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) {
            throw new Error("La búsqueda no puede estar vacía");
        }
        
        // Verificar que window.cursos existe
        if (!window.cursos || !Array.isArray(window.cursos)) {
            throw new Error("Datos de cursos no disponibles");
        }
        
        const resultados = window.cursos.filter(curso => {
            return Object.values(curso).some(valor => {
                return typeof valor === 'string' && valor.toLowerCase().includes(trimmedQuery.toLowerCase())
            }) && curso.activo
        });
        
        return resultados.length > 0 ? resultados : "No se encontraron resultados";
    } catch (error) {
        mostrarErrores([error]);
        console.error("Error al buscar:", error.message);
        return [];
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
                // remover previamente la clase "cardSeleccionado"
                document.querySelectorAll(".cardSeleccionado").forEach(card => {
                    card.classList.remove("cardSeleccionado");
                });
                document.querySelector(`#cardCurso-${cursoId}`).classList.add("cardSeleccionado");
                contenedorResultados.style.display = "none";
            });
        });
    } else {
        contenedorResultados.innerHTML = "<p>No se encontraron resultados.</p>";
    }
}