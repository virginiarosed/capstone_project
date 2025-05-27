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

// Check if file was uploaded
if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit();
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$fileType = $_FILES['profile_image']['type'];

if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
    exit();
}

// Validate file size (max 5MB)
$maxSize = 5 * 1024 * 1024; // 5MB
if ($_FILES['profile_image']['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File size too large. Maximum 5MB allowed.']);
    exit();
}

// Create upload directory if it doesn't exist
$uploadDir = '../Uploads/admin_profile_images/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Failed to create upload directory']);
        exit();
    }
}

// Generate unique filename
$extension = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
if (empty($extension)) {
    // Determine extension from MIME type
    $mimeToExt = [
        'image/jpeg' => 'jpg',
        'image/jpg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp'
    ];
    $extension = $mimeToExt[$fileType] ?? 'jpg';
}

$filename = 'admin_' . $admin_id . '_' . time() . '.' . $extension;
$targetPath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $targetPath)) {
    try {
        // Get current profile image to delete it (table renamed to 'admin')
        $stmt = $pdo->prepare("SELECT profile_image FROM admin WHERE admin_id = ?");
        $stmt->execute([$admin_id]);
        $currentImage = $stmt->fetchColumn();
        
        // Update database with new image filename (table renamed to 'admin')
        $stmt = $pdo->prepare("UPDATE admin SET profile_image = ? WHERE admin_id = ?");
        $stmt->execute([$filename, $admin_id]);
        
        // Delete old profile image if it exists and is not the default
        if ($currentImage && $currentImage !== 'profile.svg' && file_exists($uploadDir . $currentImage)) {
            unlink($uploadDir . $currentImage);
        }
        
        echo json_encode([
            'success' => true, 
            'message' => 'Profile image updated successfully',
            'image_path' => '../Uploads/admin_profile_images/' . $filename
        ]);
        
    } catch(PDOException $e) {
        // Delete uploaded file if database update fails
        if (file_exists($targetPath)) {
            unlink($targetPath);
        }
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
}
?>