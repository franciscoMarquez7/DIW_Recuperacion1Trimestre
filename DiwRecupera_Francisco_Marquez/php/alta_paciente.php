<?php
include_once("conexion.php");
$conexion = obtenerConexion();

header('Content-Type: application/json');

// Recibir y decodificar datos
$datos = json_decode(file_get_contents("php://input"), true);

// Verificar si los datos están completos
if (!$datos || !isset($datos['nombre'], $datos['email'], $datos['fechaNacimiento'], $datos['telefono'])) {
    echo json_encode(["ok" => false, "mensaje" => "Datos incompletos."]);
    exit;
}

// Escapar los datos para evitar inyecciones SQL
$nombre = mysqli_real_escape_string($conexion, $datos['nombre']);
$email = mysqli_real_escape_string($conexion, $datos['email']);
$fechaNacimiento = mysqli_real_escape_string($conexion, $datos['fechaNacimiento']);
$telefono = mysqli_real_escape_string($conexion, $datos['telefono']);
$direccion = mysqli_real_escape_string($conexion, $datos['direccion'] ?? '');

// Consulta SQL para insertar
$sql = "INSERT INTO patients (patient_name, patient_email, patient_birthdate, patient_phone, patient_address)
        VALUES ('$nombre', '$email', '$fechaNacimiento', '$telefono', '$direccion')";

// Ejecutar la consulta y verificar errores
if (mysqli_query($conexion, $sql)) {
    echo json_encode(["ok" => true, "mensaje" => "Paciente guardado con éxito."]);
} else {
    $error = mysqli_error($conexion);
    echo json_encode(["ok" => false, "mensaje" => "Error al guardar el paciente: $error"]);
}

mysqli_close($conexion);
?>
