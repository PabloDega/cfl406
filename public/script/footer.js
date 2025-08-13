console.log("Footer script loaded");

document.querySelectorAll("footer #contactos svg").forEach(svg => {
    svg.addEventListener("click", () => {
        const btnPresionado = svg.getAttribute("data-btn");
        console.log(`Button clicked: ${btnPresionado}`);
        if (btnPresionado === "whatsapp") {
            window.open("https://wa.me/541127703652", "_blank");
        } else if (btnPresionado === "instagram") {
            window.open("https://www.instagram.com/cfl406secsanmartin", "_blank");
        } else if (btnPresionado === "facebook") {
            window.open("https://www.facebook.com/cfl406.sanmartin", "_blank");
        } else if (btnPresionado === "mail") {
            window.open("mailto:cfp406secsanmartin@gmail.com", "_blank");
        } else if (btnPresionado === "telefono") {
            window.open("tel:+541153704909", "_blank");
        }
    });
});