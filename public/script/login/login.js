console.log("Login script loaded");

import { mostrarErrores, mostrarInfo } from "../mostrarError.js";

document.querySelector("#enviarFormLogin").addEventListener("click", function(event) {
    event.preventDefault();
    validarFormulario.validar();
    if(validarFormulario.error) {
        mostrarErrores([new Error("Por favor, completa todos los campos requeridos.")]);
        return;
    }
    
    const form = document.querySelector("#loginForm");
    //form.submit();
    const formData = new URLSearchParams(new FormData(form));
    fetch("/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "/panel";
        } else {
            mostrarErrores([new Error("Usuario o contraseña incorrectos.")]);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarErrores([new Error("Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.")]);
    });
});

const validarFormulario = {
    error: false,
    validar: function() {
        const inputs = document.querySelectorAll("#loginForm input");
        this.error = false;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                this.error = true;
                input.classList.add("inputError");
            } else {
                input.classList.remove("inputError");
            }
        });
    }
};