import { mostrarCortinaConModal } from "./modales.js";
import { guardarEnLS, mostrarErrores } from "../mostrar.js";

export const ABMCursos = async (accion, url) => {
  fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
      if (data.error) {
        mostrarErrores([new Error(data.msg)]);
      } else if (accion === "ver" || accion === "modificar") {
        // Aquí puedes manejar la visualización o edición del curso
        //console.log("Curso data:", data.data);
        // Por ejemplo, podrías abrir un modal con la información del curso
        // inscripcion se excluye porque se calcula automáticamente en base a la fecha de cierre
        mostrarCortinaConModal(data.data, accion, ["id", "activo", "sedeId", "idProfesor", "inscripcion"], window.clases.cursos);
      } else if (accion === "inscribir") {
        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          mostrarErrores([new Error("Redirección no proporcionada para la inscripción")]);
        }
      } else if (accion === "eliminar") {
        // Para otras acciones, recargar la página para reflejar los cambios
        guardarEnLS("flashMessage", "Curso eliminado con éxito");
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error performing action:", error);
      mostrarErrores([new Error("Error al realizar la acción")]);
    });
};

