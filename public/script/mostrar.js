export const mostrarError = (error, i) => {
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-text";
    errorSpan.id = `error-${i}`;
    errorSpan.innerHTML = `<span>${error.message}<img class="copiar" src="/im/iconos/copy.svg" alt="Copiar texto"></span><div class="barraLoad"></div>`;
    document.querySelector("#error").appendChild(errorSpan);
    document.querySelector("#error").style.display = "flex";
    cerrarError(errorSpan);
    copiarTexto(errorSpan.querySelector(".copiar"));
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

export const mostrarInfo = (mensaje) => {
    const infoSpan = document.createElement("span");
    infoSpan.className = "info-text";
    infoSpan.innerHTML = `<span>${mensaje}<img class="copiar" src="/im/iconos/copy.svg" alt="Copiar texto"></span><div class="barraLoad"></div>`;
    document.querySelector("#info").appendChild(infoSpan);
    document.querySelector("#info").style.display = "flex";
    cerrarError(infoSpan);
    copiarTexto(infoSpan.querySelector(".copiar"));
    setTimeout(() => {
        infoSpan.style.display = "none";
    }, 5000);
}

export const cerrarError = (elemento) => {
    elemento.addEventListener("click", (e) => {
        e.stopPropagation();
        elemento.style.display = "none";
    });
};

export const copiarTexto = (elemento) => {
    elemento.addEventListener("click", (e) => {
        e.stopPropagation();
        const texto = elemento.parentElement.innerText;
        navigator.clipboard.writeText(texto);
        mostrarInfo("Texto copiado al portapapeles.");
    });
};

export const mostrarDeLS = (key) => {
    const valor = localStorage.getItem(key);
    if (valor) {
        mostrarInfo(valor);
        localStorage.removeItem(key);
    }
};

export const guardarEnLS = (key, value) => {
    localStorage.setItem(key, value);
}

mostrarDeLS("flashMessage");