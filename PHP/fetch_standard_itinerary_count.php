<?php
header('Content-Type: application/json');
include('../PHP/db_connection.php');

// SQL query to count rows in the itineraries table
$sql = "SELECT COUNT(id) AS count FROM itineraries";
$result = $conn->query($sql);

// Output the count
if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(["count" => $row['count']]);
} else {
    echo json_encode(["count" => 0]);
}

// Close the connection
$conn->close();
?>
