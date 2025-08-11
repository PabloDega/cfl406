export const mostrarError = (error, i) => {
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-text";
    errorSpan.id = `error-${i}`;
    errorSpan.innerHTML = `${error.message}<div class="barraLoad"></div>`;
    document.querySelector("#error").appendChild(errorSpan);
    document.querySelector("#error").style.display = "flex";
    setTimeout(() => {
        document.querySelector(`#error-${i}`).style.display = "none";
    }, 7000);
};

export const mostrarErrores = async (errores) => {
    const contenedorErrores = document.querySelector("#error");
    contenedorErrores.innerHTML = ""; // Limpiar errores previos
    for (let i = 0; i < errores.length; i++) {
        mostrarError(errores[i], i);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};