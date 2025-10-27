console.log("Header")

import { debounce } from "./debounce.js";
import { buscar, mostrarResultados } from "./buscar.js";
import { mostrarErrores } from "./mostrar.js";

//mostrarErrores([new Error("Error de prueba 3"), new Error("Error de prueba 4")]);

let menuAbierto = false;

const encabezado = document.querySelector("header");
const botonHamburguesa = document.querySelector("#hambHeader");

function abrirMenu() {
    if (!encabezado) return;
    encabezado.style.maxHeight = "none";
    const alturaCompleta = encabezado.scrollHeight + "px";
    encabezado.style.maxHeight = "134px";
    void encabezado.offsetWidth;
    encabezado.style.transition = "max-height 0.4s ease";
    encabezado.style.maxHeight = alturaCompleta;
    encabezado.style.overflow = "visible";
}

function cerrarMenu() {
    if (!encabezado) return;
    encabezado.style.transition = "max-height 0.4s ease";
    encabezado.style.maxHeight = "134px";
    encabezado.style.overflow = "hidden";
}

botonHamburguesa?.addEventListener("click", () => {
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

// Solo ejecutar si existe el header
if (encabezado) {
    verificarDesbordamientoHorizontalEncabezado();
    window.addEventListener("resize", verificarDesbordamientoXEncabezadoDebounce);
}

// Solo agregar event listeners si existen los elementos del header
const botonesHeader = document.querySelectorAll("header .btnHeader");
if (botonesHeader.length > 0) {
    botonesHeader.forEach(btn => {
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
}

// Solo agregar buscador si existe
const txtBuscado = document.querySelector("#txtBuscado");
const btnBuscar = document.querySelector("#btnBuscar");
const resultados = document.querySelector("#resultados");

if (txtBuscado) {
    txtBuscado.addEventListener("keyup", (e) => {
        const buscado = e.target.value.trim();
        if (buscado) {
            const res = buscar(buscado);
            mostrarResultados(res);
        } else {
            if (resultados) {
                resultados.style.display = "none";
            }
        }
    });
}

if (btnBuscar) {
    btnBuscar.addEventListener("click", () => {
        const buscado = txtBuscado?.value.trim();
        if (buscado) {
            const res = buscar(buscado);
            mostrarResultados(res);
        }
    });
}