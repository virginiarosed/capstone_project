<?php
header('Content-Type: application/json');
include('../PHP/db_connection.php');

$sql = "SELECT COUNT(id) AS count FROM users";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(["count" => $row['count']]);
} else {
    echo json_encode(["count" => 0]);
}

$conn->close();
?>
