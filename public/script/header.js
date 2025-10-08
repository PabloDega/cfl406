console.log("Header")

import { debounce } from "./debounce.js";
import { buscar, mostrarResultados } from "./buscar.js";
import { mostrarErrores } from "./mostrar.js";

//mostrarErrores([new Error("Error de prueba 3"), new Error("Error de prueba 4")]);

let menuAbierto = false;

const encabezado = document.querySelector("header");
const botonHamburguesa = document.querySelector("#hambHeader");

function abrirMenu() {
    encabezado.style.maxHeight = "none";
    const alturaCompleta = encabezado.scrollHeight + "px";
    encabezado.style.maxHeight = "134px";
    void encabezado.offsetWidth;
    encabezado.style.transition = "max-height 0.4s ease";
    encabezado.style.maxHeight = alturaCompleta;
    encabezado.style.overflow = "visible";
}

function cerrarMenu() {
    encabezado.style.transition = "max-height 0.4s ease";
    encabezado.style.maxHeight = "134px";
    encabezado.style.overflow = "hidden";
}

botonHamburguesa.addEventListener("click", () => {
    if (menuAbierto) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
    menuAbierto = !menuAbierto;
});

function verificarDesbordamientoHorizontalEncabezado() {
    if (!encabezado) return;
    // Verifica si el contenido del encabezado es más ancho que el contenedor
    const desborda = encabezado.scrollWidth > encabezado.clientWidth;
    if (desborda && !encabezado.classList.contains("desborda-x")) {
        encabezado.classList.add("desborda-x");
    } else if (!desborda && encabezado.classList.contains("desborda-x")) {
        // Simula quitar la clase y verifica si sigue desbordando
        encabezado.classList.remove("desborda-x");
        const sigueDesbordando = encabezado.scrollWidth > encabezado.clientWidth;
        if (sigueDesbordando) {
            encabezado.classList.add("desborda-x");
        }
    }
}

const verificarDesbordamientoXEncabezadoDebounce = debounce(verificarDesbordamientoHorizontalEncabezado, 300);
verificarDesbordamientoHorizontalEncabezado();
window.addEventListener("resize", verificarDesbordamientoXEncabezadoDebounce);

document.querySelectorAll("header .btnHeader").forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (e.target.id === "btnHome") {
            window.location.href = "/";
        } else if (e.target.id === "btnFormacion") {
            window.location.href = "/#ofertaFormativa";
        } else if (e.target.id === "btnSedes") {
            window.location.href = "/#landMapa";
        } else if (e.target.id === "btnContactos") {
            window.location.href = "/#footer";
        }
    });
});

document.querySelector("#txtBuscado").addEventListener("keyup", (e) => {
    const buscado = e.target.value.trim();
    if (buscado) {
        const res = buscar(buscado);
        mostrarResultados(res);
    } else {
        document.querySelector("#resultados").style.display = "none";
    }
});

document.querySelector("#btnBuscar").addEventListener("click", () => {
    const buscado = document.querySelector("#txtBuscado").value.trim();
    if (buscado) {
        const res = buscar(buscado);
        mostrarResultados(res);
    }
});