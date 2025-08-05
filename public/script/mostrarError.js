export const mostrarError = (error, i) => {
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-text";
    errorSpan.id = `error-${i}`;
    errorSpan.innerHTML = `${error}<div class="barraLoad"></div>`;
    document.querySelector("#error").appendChild(errorSpan);
    document.querySelector("#error").style.display = "flex";
    setTimeout(() => {
        document.querySelector(`#error-${i}`).style.display = "none";
    }, 6000);
};

// Mostrar cada error con un delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function mostrarErroresConDelay(errors, msDelay) {
    for (let i = 0; i < errors.length; i++) {
        mostrarError(errors[i].message, i);
        await delay(msDelay);
    }
}

if(window.error && window.error.length > 0){
    mostrarErroresConDelay(window.error, 500); // 500ms de separación
}