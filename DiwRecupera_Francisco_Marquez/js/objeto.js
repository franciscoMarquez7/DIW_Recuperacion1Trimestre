"use strict";

// Clase Paciente
class Paciente {
    #id;
    #nombre;
    #fechaNacimiento;
    #telefono;
    #email;
    #direccion;

    constructor(idPaciente, nombre, fechaNacimiento, telefono, email, direccion) {
        this.#id = idPaciente;
        this.#nombre = nombre;
        this.#fechaNacimiento = fechaNacimiento;
        this.#telefono = telefono;
        this.#email = email;
        this.#direccion = direccion;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get fechaNacimiento() {
        return this.#fechaNacimiento;
    }

    get telefono() {
        return this.#telefono;
    }

    get email() {
        return this.#email;
    }

    get direccion() {
        return this.#direccion;
    }

    // Setters
    set id(value) {
        this.#id = value;
    }

    set nombre(value) {
        this.#nombre = value;
    }

    set fechaNacimiento(value) {
        this.#fechaNacimiento = value;
    }

    set telefono(value) {
        this.#telefono = value;
    }

    set email(value) {
        this.#email = value;
    }

    set direccion(value) {
        this.#direccion = value;
    }

    // Método para personalizar la salida JSON
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            fechaNacimiento: this.#fechaNacimiento,
            telefono: this.#telefono,
            email: this.#email,
            direccion: this.#direccion
        };
    }
}

// Clase Cita Médica
class CitaMedica {
    #id;
    #fecha;
    #razon;
    #diagnostico;
    #pacienteId;
    #doctorAsignado;
    #estadoCita;

    constructor(id, fecha, razon, diagnostico, pacienteId, doctorAsignado, estadoCita) {
        this.#id = id;
        this.#fecha = fecha;
        this.#razon = razon;
        this.#diagnostico = diagnostico;
        this.#pacienteId = pacienteId;
        this.#doctorAsignado = doctorAsignado;
        this.#estadoCita = estadoCita;
    }

    // Getters
    get id() {
        return this.#id;
    }

    get fecha() {
        return this.#fecha;
    }

    get razon() {
        return this.#razon;
    }

    get diagnostico() {
        return this.#diagnostico;
    }

    get pacienteId() {
        return this.#pacienteId;
    }

    get doctorAsignado() {
        return this.#doctorAsignado;
    }

    get estadoCita() {
        return this.#estadoCita;
    }

    // Setters
    set id(value) {
        this.#id = value;
    }

    set fecha(value) {
        this.#fecha = value;
    }

    set razon(value) {
        this.#razon = value;
    }

    set diagnostico(value) {
        this.#diagnostico = value;
    }

    set pacienteId(value) {
        this.#pacienteId = value;
    }

    set doctorAsignado(value) {
        this.#doctorAsignado = value;
    }

    set estadoCita(value) {
        this.#estadoCita = value;
    }

    // Método para personalizar la salida JSON
    toJSON() {
        return {
            id: this.#id,
            fecha: this.#fecha,
            razon: this.#razon,
            diagnostico: this.#diagnostico,
            pacienteId: this.#pacienteId,
            doctorAsignado: this.#doctorAsignado,
            estadoCita: this.#estadoCita
        };
    }
}

// Clase CentroMedicos (Gestión de Citas Médicas)
class CentroMedico {
    async altaPaciente(oPaciente) {
        let datos = new FormData();
        datos.append("paciente", JSON.stringify(oPaciente));

        let respuesta = await peticionPOST("php/alta_paciente.php", datos);
        return respuesta;
    }

    async altaCita(oCita) {
        let datos = new FormData();
        datos.append("cita", JSON.stringify(oCita));

        let respuesta = await peticionPOST("php/alta_cita.php", datos);
        return respuesta;
    }

    async modificarPaciente(oPaciente) {
        let datos = new FormData();

        datos.append("paciente",JSON.stringify(oPaciente));
       
        let respuesta = await peticionPOST("php/modificar_paciente.php", datos);

        return respuesta;
    }
    async borrarTarea(idPaciente) {
        let datos = new FormData();

        datos.append("ispaciente", idPaciente);

        let respuesta = await peticionPOST("borrar_paciente.php", datos);

        return respuesta;
    }

    async listadoPacientes() {
        let respuesta = await peticionGET("php/listado_pacientes.php", null);
        return respuesta;
    }

    async filtrarPacientesPorFechas(fechaInicio, fechaFin) {
        const filtros = {
            fechaInicio,
            fechaFin,
        };

        // Realizar la solicitud al backend con POST
        const respuesta = await peticionPOST("php/listado_filtrado_pacientes.php", JSON.stringify(filtros), {
            "Content-Type": "application/json",
        });

        return respuesta;
    }
}
