<?php
require_once('conexion.php');
$conexion = obtenerConexion();

header("Content-Type: application/json");

$id = $_GET['id'] ?? null;

if (!$id) {
    responder(null, false, "Falta el ID del paciente", $conexion);
}

$sql = "SELECT * FROM patients WHERE patient_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    $paciente = $resultado->fetch_assoc();
    responder($paciente, true, "Paciente encontrado", $conexion);
} else {
    responder(null, false, "Error al buscar el paciente: " . $conexion->error, $conexion);
}

$stmt->close();
$conexion->close();
?>
