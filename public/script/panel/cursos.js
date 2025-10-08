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