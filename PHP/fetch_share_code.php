<?php
// fetch_share_code.php
header('Content-Type: application/json');

// Database connection
include('../PHP/db_connection.php'); // Make sure your DB connection file is included

// Get the input data (travel_id)
$data = json_decode(file_get_contents('php://input'), true);
$travel_id = $data['travel_id'];

// Query to fetch the share code from the create_travel table
$sql = "SELECT share_code FROM create_travel WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $travel_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Fetch the share code
    $row = $result->fetch_assoc();
    echo json_encode(['success' => true, 'share_code' => $row['share_code']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Travel not found']);
}

$stmt->close();
$conn->close();
?>
