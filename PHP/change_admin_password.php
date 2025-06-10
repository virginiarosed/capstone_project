<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bondvoyage_db"; // Replace with your actual database name

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in'] || !isset($_SESSION['admin_id'])) {
    echo json_encode(['success' => false, 'message' => 'Admin not logged in']);
    exit();
}

$admin_id = $_SESSION['admin_id'];

// Validate input
if (!isset($_POST['current_password']) || !isset($_POST['new_password']) || !isset($_POST['confirm_password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$currentPassword = $_POST['current_password'];
$newPassword = $_POST['new_password'];
$confirmPassword = $_POST['confirm_password'];

// Validate data
if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

// Check password length
if (strlen($newPassword) < 8) {
    echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters long']);
    exit();
}

// Enhanced password validation
if (!preg_match('/\d/', $newPassword)) {
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one number (0-9)']);
    exit();
}

if (!preg_match('/[a-z]/', $newPassword)) {
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one lowercase letter (a-z)']);
    exit();
}

if (!preg_match('/[A-Z]/', $newPassword)) {
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one uppercase letter (A-Z)']);
    exit();
}

if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $newPassword)) {
    echo json_encode(['success' => false, 'message' => 'New password must contain at least one special symbol (!, $, etc.)']);
    exit();
}

// Check if new passwords match
if ($newPassword !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'New passwords do not match']);
    exit();
}

// Check if new password is different from current password
if ($currentPassword === $newPassword) {
    echo json_encode(['success' => false, 'message' => 'New password must be different from current password']);
    exit();
}

try {
    // Get current password hash from database
    $stmt = $pdo->prepare("SELECT password FROM admin WHERE admin_id = ?");
    $stmt->execute([$admin_id]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Admin not found']);
        exit();
    }
    
    // Verify current password
    if (!password_verify($currentPassword, $admin['password'])) {
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
        exit();
    }
    
    // Hash the new password
    $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password and password changed date in database
    $stmt = $pdo->prepare("UPDATE admin SET password = ?, password_changed_date = NOW() WHERE admin_id = ?");
    $result = $stmt->execute([$hashedNewPassword, $admin_id]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>