import { mostrarCortinaConModal } from "../cortina.js";
import { mostrarErrores } from "../mostrar.js";

export const getClase = async () => {
    try {
        const response = await fetch("/panel/cursos/clase");
        const data = await response.json();
        if (data.error) {
            throw new Error(data.msg);
        }
        return data.data;
    } catch (error) {
        console.error("Error fetching clase:", error);
        mostrarErrores([new Error("Error al obtener la clase")]);
    }
};

export const ABMCursos = async (accion, url) => {
    fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log("Data received:", data);
                if (data.error) {
                    mostrarErrores([new Error(data.msg)]);
                } else if (accion === "ver" || accion === "editar") {
                    // Aquí puedes manejar la visualización o edición del curso
                    //console.log("Curso data:", data.data);
                    // Por ejemplo, podrías abrir un modal con la información del curso
                    mostrarCortinaConModal(data.data, accion, ["id", "activo", "idProfesor", "inscripcion"], claseCursos);
                } else if (accion === "inscribir") {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    } else {
                        mostrarErrores([new Error("Redirección no proporcionada para la inscripción")]);
                    }
                } else {
                    // Para otras acciones, recargar la página para reflejar los cambios
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error("Error performing action:", error);
                mostrarErrores([new Error("Error al realizar la acción")]);
            });
};

