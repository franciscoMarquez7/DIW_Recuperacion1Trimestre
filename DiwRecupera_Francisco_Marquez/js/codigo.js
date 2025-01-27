"use strict";

// Referencias a los formularios y menús
const frmAltaPaciente = document.getElementById("frmAltaPaciente");
const frmAltaCita = document.getElementById("frmAltaCita");
const mnuAltaPaciente = document.getElementById("mnuAltaPaciente");
const mnuAltaCita = document.getElementById("mnuAltaCita");
const mnuBuscarPaciente = document.getElementById("mnuBuscarPaciente");
const mnuBuscarCita = document.getElementById("mnuBuscarCita");
const frmListadoPaciente = document.getElementById("frmListadoPaciente");
const mnuListadoPaciente = document.getElementById("mnuListadoPaciente");
const frmModificarPaciente = document.getElementById("frmModificarPaciente");
const mnuModificarPaciente = document.getElementById("mnuModificarPaciente");
const frmListadoFiltradoPaciente = document.getElementById("frmListadoFiltradoPaciente");
const filtroFechaInicioPaciente = document.getElementById("filtroFechaInicioPaciente");
const filtroFechaFinPaciente = document.getElementById("filtroFechaFinPaciente");
const btnFiltrarPacientes = document.getElementById("btnFiltrarPacientes");
const listadoFiltradoPacientes = document.getElementById("listadoFiltradoPacientes");

document.addEventListener("DOMContentLoaded", () => {
    if (mnuAltaPaciente) mnuAltaPaciente.addEventListener("click", () => mostrarFormulario(frmAltaPaciente));
    if (mnuAltaCita) mnuAltaCita.addEventListener("click", () => mostrarFormulario(frmAltaCita));
    if (mnuListadoPaciente) mnuListadoPaciente.addEventListener("click", () => {
        mostrarFormulario(frmListadoPaciente);
        mostrarListadoPacientes();
    });
    if (mnuBuscarPaciente) mnuBuscarPaciente.addEventListener("click", buscarPaciente);
    if (mnuBuscarCita) mnuBuscarCita.addEventListener("click", buscarCita);
    if (mnuModificarPaciente) mnuModificarPaciente.addEventListener("click", () => {
        mostrarFormulario(frmListadoPaciente);
        mostrarListadoPacientes();
    });
    document.getElementById("btnAltaPaciente").addEventListener("click", guardarPaciente);
    document.getElementById("btnAltaCita").addEventListener("click", guardarCita);
    document.getElementById("mnuAltaCita").addEventListener("click", () => {
        mostrarFormulario(frmAltaCita);
        cargarPacientes(); 
    });  
    btnFiltrarPacientes.addEventListener("click", mostrarListadoFiltradoPacientes);
    document.getElementById("mnuListadoFiltradoPaciente").addEventListener("click", () => {
        mostrarFormulario(frmListadoFiltradoPaciente);
    });      

    ocultarFormularios();
});

function mostrarFormulario(formulario) {
    console.log("Mostrando formulario:", formulario?.id);
    ocultarFormularios();
    if (formulario) formulario.classList.remove("d-none");
}

function ocultarFormularios() {
    const formularios = [frmAltaPaciente, frmAltaCita, frmListadoPaciente, frmModificarPaciente, frmListadoFiltradoPaciente];
    formularios.forEach((formulario) => formulario?.classList.add("d-none"));
}

async function guardarPaciente() {
    const paciente = {
        nombre: document.getElementById("nombrePaciente").value.trim(),
        email: document.getElementById("emailPaciente").value.trim(),
        fechaNacimiento: document.getElementById("fechaNacimientoPaciente").value.trim(),
        telefono: document.getElementById("telefonoPaciente").value.trim(),
        direccion: document.getElementById("direccionPaciente").value.trim(),
    };

    if (!paciente.nombre || !paciente.email || !paciente.fechaNacimiento || !paciente.telefono) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const respuesta = await enviarDatos("php/alta_paciente.php", paciente);
    alert(respuesta.mensaje);
    if (respuesta.ok) frmAltaPaciente.reset();
}

async function guardarCita() {
    const cita = {
        pacienteId: document.getElementById("lstPacientes").value.trim(),
        fecha: document.getElementById("fechaCita").value.trim(),
        razon: document.getElementById("razonCita").value.trim(),
        diagnostico: document.getElementById("diagnosticoCita").value.trim(),
        doctorAsignado: document.getElementById("doctorCita").value.trim(),
        estadoCita: document.getElementById("estadoCita").value,
    };

    console.log("Datos enviados (Alta Cita):", cita);

    if (!cita.pacienteId || !cita.fecha || !cita.razon || !cita.doctorAsignado || !cita.estadoCita) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    try {
        const respuesta = await fetch("php/alta_cita.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cita),
        });

        const textoRespuesta = await respuesta.text();
        console.log("Respuesta cruda del servidor:", textoRespuesta);

        const resultado = JSON.parse(textoRespuesta);
        alert(resultado.mensaje);

        if (resultado.ok) {
            frmAltaCita.reset();
        }
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        alert("Error al intentar guardar la cita. Verifica tu conexión.");
    }
}



async function cargarPacientes() {
    try {
        const respuesta = await fetch("php/obtener_pacientes.php");
        const datos = await respuesta.json();

        if (datos.ok) {
            const lstPacientes = document.getElementById("lstPacientes");
            lstPacientes.innerHTML = "<option value=''>Seleccione un paciente</option>";

            for (const paciente of datos.datos) {
                const option = document.createElement("option");
                option.value = paciente.patient_id;
                option.textContent = paciente.patient_name;
                lstPacientes.appendChild(option);
            }
        } else {
            alert("Error al cargar pacientes: " + datos.mensaje);
        }
    } catch (error) {
        console.error("Error al cargar pacientes:", error);
        alert("Error de conexión al cargar los pacientes.");
    }
}

async function buscarPaciente() {
    const id = prompt("Ingrese el ID del paciente a buscar:");
    if (!id) return;

    const respuesta = await fetch(`php/buscar_paciente.php?id=${id}`);
    const datos = await respuesta.json();

    if (datos.ok) alert(`Paciente encontrado:\n${JSON.stringify(datos.datos, null, 2)}`);
    else alert("Paciente no encontrado.");
}

async function buscarCita() {
    const id = prompt("Ingrese el ID de la cita a buscar:");
    if (!id) return;

    const respuesta = await fetch(`php/buscar_cita.php?id=${id}`);
    const datos = await respuesta.json();

    if (datos.ok) alert(`Cita encontrada:\n${JSON.stringify(datos.datos, null, 2)}`);
    else alert("Cita no encontrada.");
}

async function mostrarListadoPacientes() {
    try {
        const respuesta = await fetch("php/listado_pacientes.php");
        const datos = await respuesta.json();

        if (datos.ok) {
            const listadoPacientes = document.getElementById("listadoPacientes");

            let html = `
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (const paciente of datos.datos) {
                html += `
                    <tr>
                        <td>${paciente.patient_id}</td>
                        <td>${paciente.patient_name}</td>
                        <td>${paciente.patient_email}</td>
                        <td>${paciente.patient_birthdate}</td>
                        <td>${paciente.patient_phone}</td>
                        <td>${paciente.patient_address}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="procesarBotonEditarPaciente(event)" data-paciente='${JSON.stringify(paciente)}'>
                                Modificar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="borrarPaciente(event)" data-idpaciente="${paciente.patient_id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            }

            html += `
                    </tbody>
                </table>
            `;

            listadoPacientes.innerHTML = html;
        } else {
            alert("Error al cargar el listado de pacientes: " + datos.mensaje);
        }
    } catch (error) {
        console.error("Error al cargar el listado de pacientes:", error);
        alert("Error de conexión al cargar el listado de pacientes.");
    }
}

async function borrarPaciente(oEvento) {
    let boton = oEvento.target;
    let idPaciente = boton.dataset.idpaciente;

    if (!confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
        return;
    }

    try {
        const respuesta = await fetch(`php/borrar_paciente.php?id=${idPaciente}`, { method: "DELETE" });
        const resultado = await respuesta.json();

        if (resultado.ok) {
            alert(resultado.mensaje);
            // Recargar el listado
            mostrarListadoPacientes();
        } else {
            alert("Error al eliminar el paciente: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error al eliminar el paciente:", error);
        alert("Error de conexión al intentar eliminar el paciente.");
    }
}


function procesarBotonEditarPaciente(oEvento) {
    let boton = oEvento.target;

    if (boton.nodeName === "I") {
        boton = boton.parentElement;
    }

    const paciente = JSON.parse(boton.dataset.paciente);

    ocultarFormularios();
    frmModificarPaciente.classList.remove("d-none");

    document.getElementById("txtModIdPaciente").value = paciente.patient_id;
    document.getElementById("txtModNombrePaciente").value = paciente.patient_name;
    document.getElementById("txtModEmailPaciente").value = paciente.patient_email;
    document.getElementById("txtModTelefonoPaciente").value = paciente.patient_phone;
    document.getElementById("txtModFechaNacimientoPaciente").value = paciente.patient_birthdate;
    document.getElementById("txtModDireccionPaciente").value = paciente.patient_address;
}

async function procesarModificarPaciente() {
    // Datos del formulario
    const datosPaciente = {
        patient_id: document.getElementById("txtModIdPaciente").value.trim(),
        patient_name: document.getElementById("txtModNombrePaciente").value.trim(),
        patient_email: document.getElementById("txtModEmailPaciente").value.trim(),
        patient_phone: document.getElementById("txtModTelefonoPaciente").value.trim(),
        patient_birthdate: document.getElementById("txtModFechaNacimientoPaciente").value.trim(),
        patient_address: document.getElementById("txtModDireccionPaciente").value.trim(),
    };

    try {
        const respuesta = await fetch("php/modificar_paciente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosPaciente),
        });

        // Leer la respuesta como texto para inspección
        const textoRespuesta = await respuesta.text();
        console.log("Respuesta cruda del servidor:", textoRespuesta);

        // Intentar parsear como JSON
        const resultado = JSON.parse(textoRespuesta);
        alert(resultado.mensaje);

        if (!resultado.error) {
            mostrarListadoPacientes();
            frmModificarPaciente.classList.add("d-none");
        }
    } catch (error) {
        console.error("Error al modificar el paciente:", error);
        alert("Error de conexión al intentar modificar el paciente.");
    }
}

async function mostrarListadoFiltradoPacientes() {
    // Validar que ambas fechas estén seleccionadas
    const fechaInicio = filtroFechaInicioPaciente.value.trim();
    const fechaFin = filtroFechaFinPaciente.value.trim();

    if (!fechaInicio || !fechaFin) {
        alert("Por favor, selecciona ambas fechas para filtrar.");
        return;
    }

    // Crear el objeto de filtros
    const filtros = { fechaInicio, fechaFin };

    try {
        // Enviar la solicitud al backend
        const respuesta = await fetch("php/listado_pacientes_filtrado.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filtros),
        });

        const datos = await respuesta.json();

        // Validar respuesta del servidor
        if (datos.ok) {
            // Crear la tabla con los resultados
            let html = `
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            datos.datos.forEach(paciente => {
                html += `
                    <tr>
                        <td>${paciente.patient_id}</td>
                        <td>${paciente.patient_name}</td>
                        <td>${paciente.patient_email}</td>
                        <td>${paciente.patient_birthdate}</td>
                        <td>${paciente.patient_phone || "N/A"}</td>
                        <td>${paciente.patient_address || "N/A"}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            // Mostrar los resultados en el contenedor
            listadoFiltradoPacientes.innerHTML = html;
            frmListadoFiltradoPaciente.classList.remove("d-none");
        } else {
            alert(datos.mensaje || "No se encontraron pacientes en el rango de fechas.");
        }
    } catch (error) {
        console.error("Error al filtrar pacientes:", error);
        alert("Hubo un error al intentar filtrar los pacientes. Verifica tu conexión.");
    }
}



async function enviarDatos(url, datos) {
    try {
        const respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al enviar datos:", error);
        return { ok: false, mensaje: "Error de conexión" };
    }
}
