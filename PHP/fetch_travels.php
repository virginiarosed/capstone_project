<?php
session_start();
require '../PHP/db_connection.php';  // Include your DB connection

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$userId = $_SESSION['user_id']; // Get the logged-in user's ID

// Fetch travels created by the user or where the user is a collaborator
$sql = "
    SELECT id, travel_name, 'creator' AS role
    FROM create_travel
    WHERE user_id = ? 
    UNION
    SELECT ct.id, ct.travel_name, 'collaborator' AS role
    FROM create_travel ct
    JOIN travel_collaborators tc ON ct.id = tc.travel_id
    WHERE tc.user_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $userId, $userId);
$stmt->execute();
$result = $stmt->get_result();

// Fetch all the travels
$travels = [];
while ($row = $result->fetch_assoc()) {
    $travels[] = $row;
}

$stmt->close();
$conn->close();

// Return the travels as JSON
echo json_encode(['success' => true, 'travels' => $travels]);
?>
