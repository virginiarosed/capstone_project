<?php
// Start session
session_start();

// Include the database connection file
include('../PHP/db_connection.php');

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

// Fetch user ID from session
$user_id = $_SESSION['user_id'];

// Query to fetch user details
$sql = "SELECT first_name, last_name, email FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Fetch user details and return as JSON
if ($user = $result->fetch_assoc()) {
    echo json_encode($user);
} else {
    echo json_encode(['error' => 'User not found']);
}

// Close the database connection
$stmt->close();
$conn->close();
?>
