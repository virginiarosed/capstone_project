<?php
session_start();
require_once 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];
$message = $input['message'];
$sender = $input['sender']; // 'user' or 'bot'
$session_id = $input['session_id'] ?? session_id();

$stmt = $conn->prepare("INSERT INTO chatbot_messages (user_id, message, sender, session_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $user_id, $message, $sender, $session_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message_id' => $conn->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save message']);
}
?>