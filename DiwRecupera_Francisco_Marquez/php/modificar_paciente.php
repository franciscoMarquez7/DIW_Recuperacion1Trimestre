<?php
include_once("conexion.php");
$conexion = obtenerConexion();

// Configurar la cabecera para devolver JSON
header('Content-Type: application/json');

// Recoger datos enviados desde el cliente
$datos = json_decode(file_get_contents("php://input"), true);

if (!$datos || !isset($datos['patient_id'])) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Datos incompletos o inválidos."
    ]);
    exit;
}

// Escapar valores para prevenir inyección SQL
$patient_id = mysqli_real_escape_string($conexion, $datos['patient_id']);
$patient_name = mysqli_real_escape_string($conexion, $datos['patient_name']);
$patient_email = mysqli_real_escape_string($conexion, $datos['patient_email']);
$patient_birthdate = mysqli_real_escape_string($conexion, $datos['patient_birthdate']);
$patient_phone = mysqli_real_escape_string($conexion, $datos['patient_phone']);
$patient_address = mysqli_real_escape_string($conexion, $datos['patient_address']);

// Construir la consulta SQL
$sql = "UPDATE patients
        SET patient_name = '$patient_name',
            patient_email = '$patient_email',
            patient_birthdate = '$patient_birthdate',
            patient_phone = '$patient_phone',
            patient_address = '$patient_address'
        WHERE patient_id = $patient_id";

// Intentar ejecutar la consulta
if (mysqli_query($conexion, $sql)) {
    echo json_encode([
        "ok" => true,
        "mensaje" => "Paciente modificado con éxito."
    ]);
} else {
    $numError = mysqli_errno($conexion);
    $descError = mysqli_error($conexion);

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error $numError: $descError"
    ]);
}

mysqli_close($conexion);
?>
