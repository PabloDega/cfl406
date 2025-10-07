import { mostrarErrores, mostrarInfo } from "./mostrarError.js";

console.log("Footer script loaded");

document.querySelectorAll("footer #contactos svg").forEach(svg => {
    svg.addEventListener("click", () => {
        const btnPresionado = svg.getAttribute("data-btn");
        if (btnPresionado === "whatsapp") {
            window.open("https://wa.me/541127703652", "_blank");
        } else if (btnPresionado === "instagram") {
            window.open("https://www.instagram.com/cfl406secsanmartin", "_blank");
        } else if (btnPresionado === "facebook") {
            window.open("https://www.facebook.com/cfl406.sanmartin", "_blank");
        } else if (btnPresionado === "mail") {
            navigator.clipboard.writeText("cfp406secsanmartin@gmail.com")
                .then(() => {
                    mostrarInfo("Dirección de correo copiada al portapapeles.");
                })
                .catch(() => {
                    mostrarErrores([new Error("No se pudo copiar la dirección de correo.")]);
                });
        } else if (btnPresionado === "telefono") {
            // detectar si es movil o pc
            if (/Mobi|Android/i.test(navigator.userAgent)) {
                window.location.href = "tel:+541153704909";
            } else {
                mostrarInfo("Podes llamarnos al +54 11 5370-4909");
            }
        }
    });
});