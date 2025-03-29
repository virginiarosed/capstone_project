<?php
header('Content-Type: application/json');
include('../PHP/db_connection.php');

// Query to count the number of ids in the create_travel table
$sql = "SELECT COUNT(id) AS count FROM create_travel";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(["count" => $row['count']]);
} else {
    echo json_encode(["count" => 0]);
}

$conn->close();
?>
