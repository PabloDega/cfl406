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