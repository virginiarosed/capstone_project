<?php
session_start(); // Make sure session is started
require '../PHP/db_connection.php';  // Include your DB connection

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate input data
if (empty($data['travel_name']) || empty($data['share_code'])) { // No more travel_description
    echo json_encode(['success' => false, 'message' => 'Missing travel details']);
    exit;
}

$travelName = $data['travel_name'];
$shareCode = $data['share_code'];
$userId = $_SESSION['user_id']; // Assuming user ID is stored in session

// Prepare the SQL query to insert the new travel record
$sql = "INSERT INTO create_travel (user_id, travel_name, share_code) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $userId, $travelName, $shareCode);

// Execute and check if the insert was successful
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
