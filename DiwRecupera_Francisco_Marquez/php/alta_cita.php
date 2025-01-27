<?php
include_once("conexion.php");
$conexion = obtenerConexion();

header('Content-Type: application/json');

// Decodificar datos recibidos
$datos = json_decode(file_get_contents("php://input"), true);

// Verificar si los datos están completos
if (!$datos || !isset($datos['pacienteId'], $datos['fecha'], $datos['razon'], $datos['doctorAsignado'], $datos['estadoCita'])) {
    echo json_encode(["ok" => false, "mensaje" => "Datos incompletos."]);
    exit;
}

// Escapar los datos
$pacienteId = mysqli_real_escape_string($conexion, $datos['pacienteId']);
$fecha = mysqli_real_escape_string($conexion, $datos['fecha']);
$razon = mysqli_real_escape_string($conexion, $datos['razon']);
$diagnostico = mysqli_real_escape_string($conexion, $datos['diagnostico'] ?? '');
$doctorAsignado = mysqli_real_escape_string($conexion, $datos['doctorAsignado']);
$estadoCita = mysqli_real_escape_string($conexion, $datos['estadoCita']);

// Consulta SQL para insertar en la tabla `medical_appointments`
$sql = "INSERT INTO medical_appointments (
            appointment_date, appointment_reason, appointment_diagnostic, 
            doctor_assigned, estado_cita, patient_id
        )
        VALUES (
            '$fecha', '$razon', '$diagnostico', 
            '$doctorAsignado', '$estadoCita', '$pacienteId'
        )";

if (mysqli_query($conexion, $sql)) {
    echo json_encode(["ok" => true, "mensaje" => "Cita guardada con éxito."]);
} else {
    $error = mysqli_error($conexion);
    echo json_encode(["ok" => false, "mensaje" => "Error al guardar la cita: $error"]);
}

mysqli_close($conexion);
?>
