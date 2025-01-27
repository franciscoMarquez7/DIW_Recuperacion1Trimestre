<?php
require_once('conexion.php');
$conexion = obtenerConexion();

header("Content-Type: application/json");

$id = $_GET['id'] ?? null;

if (!$id) {
    responder(null, false, "Falta el ID de la cita", $conexion);
}

$sql = "SELECT * FROM medical_appointments WHERE appointment_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    $cita = $resultado->fetch_assoc();
    responder($cita, true, "Cita encontrada", $conexion);
} else {
    responder(null, false, "Error al buscar la cita: " . $conexion->error, $conexion);
}

$stmt->close();
$conexion->close();
?>
