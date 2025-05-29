<?php
session_start();
require_once 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];
$limit = $_GET['limit'] ?? 50; // Last 50 messages

// Get user profile image along with messages
$stmt = $conn->prepare("
    SELECT cm.message, cm.sender, cm.timestamp, u.profile_image 
    FROM chatbot_messages cm 
    JOIN users u ON cm.user_id = u.id 
    WHERE cm.user_id = ? 
    ORDER BY cm.timestamp ASC 
    LIMIT ?
");
$stmt->bind_param("ii", $user_id, $limit);
$stmt->execute();
$result = $stmt->get_result();

$messages = [];
$userProfileImage = null;

while ($row = $result->fetch_assoc()) {
    // Store user profile image (will be the same for all rows)
    if ($userProfileImage === null) {
        $userProfileImage = $row['profile_image'];
    }
    
    $messages[] = [
        'message' => $row['message'],
        'sender' => $row['sender'],
        'timestamp' => $row['timestamp']
    ];
}

// If no messages but user exists, get profile image separately
if (empty($messages)) {
    $stmt = $conn->prepare("SELECT profile_image FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $userProfileImage = $row['profile_image'];
    }
}

echo json_encode([
    'success' => true, 
    'messages' => $messages,
    'user_profile_image' => $userProfileImage
]);
?>