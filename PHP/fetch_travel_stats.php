<?php
session_start();
require '../PHP/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];

// Get total unique travel IDs (created + joined)
$totalSql = "
    SELECT COUNT(DISTINCT travel_id) AS total_joined 
    FROM travel_collaborators 
    WHERE user_id = ?
";
$createdSql = "
    SELECT COUNT(*) AS total_created 
    FROM create_travel 
    WHERE user_id = ?
";

// Fetch created count
$stmtCreated = $conn->prepare($createdSql);
$stmtCreated->bind_param("i", $userId);
$stmtCreated->execute();
$createdResult = $stmtCreated->get_result()->fetch_assoc();
$totalCreated = $createdResult['total_created'] ?? 0;
$stmtCreated->close();

// Fetch joined count
$stmtJoined = $conn->prepare($totalSql);
$stmtJoined->bind_param("i", $userId);
$stmtJoined->execute();
$joinedResult = $stmtJoined->get_result()->fetch_assoc();
$totalJoined = $joinedResult['total_joined'] ?? 0;
$stmtJoined->close();

$conn->close();

// Return total
echo json_encode([
    'success' => true,
    'total' => $totalCreated + $totalJoined,
    'created' => $totalCreated,
    'joined' => $totalJoined
]);
?>
