export const normalizarGetCurso = (curso) => {
  console.log("Normalizing course data:", curso);
  const normalizados = {
    ...curso,
    dias: typeof curso.dias === "string" ? JSON.parse(curso.dias) : curso.dias,
    requisitos:
      typeof curso.requisitos === "string"
        ? JSON.parse(curso.requisitos)
        : curso.requisitos,
    temario:
      typeof curso.temario === "string"
        ? JSON.parse(curso.temario)
        : curso.temario,
    area:
      curso["Area.area"] !== null
        ? (curso.area = curso["Area.area"])
        : null,
    sede:
      curso["Sede.nombre"] !== null
        ? (curso.sede = curso["Sede.nombre"])
        : null,
    titulo:
      curso["Titulo.titulo"] !== null
        ? (curso.titulo = curso["Titulo.titulo"])
        : null,
    modalidad:
      curso["Modalidad.modalidad"] !== null
        ? (curso.modalidad = curso["Modalidad.modalidad"])
        : null,
    docente:
      curso["Docente.nombre"] !== null
        ? (curso.docente = curso["Docente.nombre"])
        : null,
  };
  delete normalizados["Area.area"];
  delete normalizados["Sede.nombre"];
  delete normalizados["Titulo.titulo"];
  delete normalizados["Modalidad.modalidad"];
  delete normalizados["Docente.nombre"];
  return normalizados;
};
