<?php
require_once('conexion.php');
$conexion = obtenerConexion();

header("Content-Type: application/json");

$sql = "SELECT patient_id, patient_name FROM patients ORDER BY patient_name ASC";
$resultado = $conexion->query($sql);

if ($resultado) {
    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }
    echo json_encode([
        "ok" => true,
        "datos" => $datos
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al obtener los pacientes: " . $conexion->error
    ]);
}
?>
