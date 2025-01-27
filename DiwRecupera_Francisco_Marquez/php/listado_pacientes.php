<?php
require_once('conexion.php');
$conexion = obtenerConexion();

header("Content-Type: application/json");

$sql = "SELECT * FROM patients ORDER BY patient_name ASC";
$resultado = $conexion->query($sql);

if ($resultado) {
    $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    responder($datos, true, "Pacientes listados con éxito", $conexion);
} else {
    responder(null, false, "Error al listar pacientes: " . $conexion->error, $conexion);
}
?>
