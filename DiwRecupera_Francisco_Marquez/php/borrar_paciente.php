<?php
require_once('conexion.php');
$conexion = obtenerConexion();

header("Content-Type: application/json");

// Validar el parámetro ID
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "No se ha proporcionado un ID válido."
    ]);
    exit;
}

$idPaciente = mysqli_real_escape_string($conexion, $_GET['id']);

// Construir la consulta SQL
$sql = "DELETE FROM patients WHERE patient_id = $idPaciente";

// Intentar ejecutar la consulta
if (mysqli_query($conexion, $sql)) {
    if (mysqli_affected_rows($conexion) > 0) {
        echo json_encode([
            "ok" => true,
            "mensaje" => "Paciente eliminado con éxito."
        ]);
    } else {
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se encontró un paciente con ese ID."
        ]);
    }
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
