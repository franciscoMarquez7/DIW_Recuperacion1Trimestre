<?php
require_once('conexion.php');
$conexion = obtenerConexion();

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['fechaInicio'], $data['fechaFin'])) {
    echo json_encode(["ok" => false, "mensaje" => "Faltan fechas de inicio o fin."]);
    exit;
}

$fechaInicio = $data['fechaInicio'];
$fechaFin = $data['fechaFin'];

$sql = "SELECT * FROM patients WHERE patient_birthdate BETWEEN ? AND ? ORDER BY patient_birthdate ASC";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $fechaInicio, $fechaFin);

if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    $pacientes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $pacientes[] = $fila;
    }

    echo json_encode(["ok" => true, "datos" => $pacientes]);
} else {
    echo json_encode(["ok" => false, "mensaje" => "Error al filtrar pacientes: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
