<?php
// get_share_code.php
header('Content-Type: application/json');
require_once '../PHP/db_connection.php';  // Ensure you have a DB connection file

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);
$travelId = $data['travel_id'];

// Fetch the share code from the database
$query = "SELECT share_code FROM create_travel WHERE id = :travel_id";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':travel_id', $travelId, PDO::PARAM_INT);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'share_code' => $row['share_code']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Share code not found.']);
}
?>
