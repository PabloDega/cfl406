console.log("Agregar curso script loaded");

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar formulario
    const formulario = document.getElementById('formAgregarCurso');
    if (formulario) {
        inicializarFormulario();
    }
    
    // Inicializar validaciones de fecha
    inicializarValidacionesFecha();
});

function inicializarFormulario() {
    const formulario = document.getElementById('formAgregarCurso');
    
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Procesar checkboxes de días
        const dias = [];
        document.querySelectorAll('input[name="dias"]:checked').forEach(checkbox => {
            dias.push(checkbox.value);
        });
        formData.set('dias', JSON.stringify(dias));
        
        // Procesar requisitos
        const requisitosText = formData.get('requisitos');
        if (requisitosText) {
            const requisitos = requisitosText.split('\n').filter(req => req.trim() !== '');
            formData.set('requisitos', JSON.stringify(requisitos));
        } else {
            formData.set('requisitos', JSON.stringify([]));
        }
        
        // Convertir FormData a objeto
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'activo') {
                // El checkbox envía 'on' cuando está marcado, no 'true'
                data[key] = value === 'on' || value === true;
            } else if (key === 'codigo' || key === 'año' || key === 'idProfesor') {
                data[key] = parseInt(value);
            } else {
                data[key] = value;
            }
        }
        
        // Si el checkbox no está marcado, no aparecerá en FormData, así que lo ponemos en false
        if (!formData.has('activo')) {
            data.activo = false;
        }
        
        // Validar campos obligatorios
        if (!validarCamposObligatorios(data)) {
            return;
        }
        
        // Enviar datos
        await postAgregarCurso(data);
    });
}

function validarCamposObligatorios(data) {
    const camposObligatorios = [
        'curso', 'codigo', 'titulo', 'area', 'modalidad', 'sede', 
        'año', 'inicio', 'fin', 'cierreInscripciones', 'duracion', 
        'horario', 'idProfesor', 'profesor', 'descripcion'
    ];
    
    const camposFaltantes = camposObligatorios.filter(campo => 
        !data[campo] || data[campo].toString().trim() === ''
    );
    
    if (camposFaltantes.length > 0) {
        mostrarError(`Faltan campos obligatorios: ${camposFaltantes.join(', ')}`, 5);
        
        // Resaltar campos faltantes
        camposFaltantes.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.classList.add('inputError');
                setTimeout(() => {
                    input.classList.remove('inputError');
                }, 3000);
            }
        });
        
        return false;
    }
    
    // Validar días seleccionados
    const diasSeleccionados = JSON.parse(data.dias || '[]');
    if (diasSeleccionados.length === 0) {
        mostrarError('Debe seleccionar al menos un día de la semana', 5);
        return false;
    }
    
    return true;
}

export const postAgregarCurso = async (data, accion = 'insert') => {
    console.log(`Enviando datos para ${accion === 'insert' ? 'agregar' : 'modificar'} curso:`, data);
    try {
        // Mostrar loading
        const submitBtn = document.querySelector('#btnPopUpAceptar') || document.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent || 'Guardar';
        if (submitBtn) {
            submitBtn.textContent = '⏳ Guardando...';
            submitBtn.disabled = true;
        }
        
        // Construir URL según la acción
        let url = '/panel/cursos/agregar';
        if (accion === 'update' && data.id) {
            url = `/panel/cursos/modificar/${data.id}`;
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, accion})
        });
        
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        
        if (result.error) {
            mostrarError('Error: ' + result.msg, 5);
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            return {error: true, msg: result.msg};
        } else {
            const mensaje = accion === 'insert' ? 'Curso agregado exitosamente' : 'Curso modificado exitosamente';
            mostrarInfo(mensaje, 3);
            
            // Guardar mensaje para mostrar en el panel
            localStorage.setItem('flashMessage', mensaje);
            
            // Redirigir al panel después de un breve retraso
            setTimeout(() => {
                window.location.href = '/panel';
            }, 1500);
            return {error: false, msg: mensaje};
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al enviar el formulario. Verifique su conexión.', 5);
        return {error: true, msg: 'Error de conexión'};
    } finally {
        // Restaurar botón
        const submitBtn = document.querySelector('#btnPopUpAceptar') || document.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.getAttribute('data-original-text') || 'Guardar';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

function inicializarValidacionesFecha() {
    const inicioInput = document.getElementById('inicio');
    const finInput = document.getElementById('fin');
    const cierreInput = document.getElementById('cierreInscripciones');
    
    if (inicioInput) {
        inicioInput.addEventListener('change', function() {
            const inicioDate = new Date(this.value);
            
            // La fecha de fin debe ser posterior al inicio
            if (finInput) {
                finInput.min = this.value;
            }
            
            // El cierre de inscripciones debe ser anterior al inicio
            if (cierreInput) {
                cierreInput.max = this.value;
            }
            
            // Validar fecha no sea muy antigua
            const hoy = new Date();
            if (inicioDate < hoy) {
                mostrarError('La fecha de inicio no puede ser anterior a hoy', 3);
                this.value = '';
            }
        });
    }
    
    if (finInput) {
        finInput.addEventListener('change', function() {
            // La fecha de inicio debe ser anterior al fin
            if (inicioInput) {
                inicioInput.max = this.value;
            }
            
            // Validar que la fecha de fin sea posterior al inicio
            const inicioDate = new Date(inicioInput.value);
            const finDate = new Date(this.value);
            
            if (finDate <= inicioDate) {
                mostrarError('La fecha de fin debe ser posterior a la fecha de inicio', 3);
                this.value = '';
            }
        });
    }
    
    if (cierreInput) {
        cierreInput.addEventListener('change', function() {
            // Validar que el cierre sea anterior al inicio
            const inicioDate = new Date(inicioInput.value);
            const cierreDate = new Date(this.value);
            
            if (inicioDate && cierreDate >= inicioDate) {
                mostrarError('El cierre de inscripciones debe ser anterior al inicio del curso', 3);
                this.value = '';
            }
        });
    }
}

// Funciones para mostrar mensajes (compatibles con el sistema existente)
function mostrarError(mensaje, duracion = 5) {
    let errorDiv = document.getElementById('error');
    
    if (!errorDiv) {
        errorDiv = crearElementoError();
    }
    
    const errorText = errorDiv.querySelector('.error-text');
    if (errorText) {
        errorText.textContent = mensaje;
    }
    
    errorDiv.style.display = 'flex';
    
    // Auto-hide
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, duracion * 1000);
    
    // Click para cerrar
    errorDiv.onclick = () => {
        errorDiv.style.display = 'none';
    };
}

function mostrarInfo(mensaje, duracion = 3) {
    let infoDiv = document.getElementById('info');
    
    if (!infoDiv) {
        infoDiv = crearElementoInfo();
    }
    
    const infoText = infoDiv.querySelector('.info-text');
    if (infoText) {
        infoText.textContent = mensaje;
    }
    
    infoDiv.style.display = 'flex';
    
    // Auto-hide
    setTimeout(() => {
        infoDiv.style.display = 'none';
    }, duracion * 1000);
    
    // Click para cerrar
    infoDiv.onclick = () => {
        infoDiv.style.display = 'none';
    };
}

function crearElementoError() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error';
    errorDiv.innerHTML = '<div class="error-text"></div><div class="barraLoad"></div>';
    document.body.appendChild(errorDiv);
    return errorDiv;
}

function crearElementoInfo() {
    const infoDiv = document.createElement('div');
    infoDiv.id = 'info';
    infoDiv.innerHTML = '<div class="info-text"></div><div class="barraLoad"></div>';
    document.body.appendChild(infoDiv);
    return infoDiv;
}

// Utilidades adicionales
function limpiarFormulario() {
    const formulario = document.getElementById('formAgregarCurso');
    if (formulario) {
        formulario.reset();
        
        // Limpiar checkboxes
        document.querySelectorAll('input[name="dias"]:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Restaurar valores por defecto
        const añoInput = document.getElementById('año');
        if (añoInput) {
            añoInput.value = new Date().getFullYear();
        }
        
        const activoInput = document.getElementById('activo');
        if (activoInput) {
            activoInput.checked = true;
        }
    }
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    // Validar código único
    const codigoInput = document.getElementById('codigo');
    if (codigoInput) {
        codigoInput.addEventListener('blur', async function() {
            const codigo = this.value;
            if (codigo) {
                // Aquí podrías agregar validación de código único
                console.log('Validando código:', codigo);
            }
        });
    }
    
    // Formatear nombre del profesor
    const profesorInput = document.getElementById('profesor');
    if (profesorInput) {
        profesorInput.addEventListener('blur', function() {
            // Capitalizar nombre
            this.value = this.value.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        });
    }
});