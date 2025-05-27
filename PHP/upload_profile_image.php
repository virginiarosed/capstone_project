<?php
// Start session
session_start();

// Include the database connection file
include('../PHP/db_connection.php');

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

// Fetch user ID from session
$user_id = $_SESSION['user_id'];

// Check if image was uploaded
if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No image uploaded or upload error']);
    exit();
}

// Define upload directory
$upload_dir = '../Uploads/profile_images/';

// Create the directory if it doesn't exist
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Get file information
$file_name = $_FILES['profile_image']['name'];
$file_tmp = $_FILES['profile_image']['tmp_name'];
$file_size = $_FILES['profile_image']['size'];
$file_type = $_FILES['profile_image']['type'];

// Generate a unique filename to prevent overwriting
$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
$unique_filename = $user_id . '_' . uniqid() . '.' . $file_ext;
$upload_path = $upload_dir . $unique_filename;

// Validate file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($file_type, $allowed_types)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, and GIF are allowed.']);
    exit();
}

// Validate file size (limit to 5MB)
$max_size = 5 * 1024 * 1024; // 5MB in bytes
if ($file_size > $max_size) {
    echo json_encode(['success' => false, 'message' => 'File size too large. Maximum 5MB allowed.']);
    exit();
}

// Process rotation if specified
$rotation = isset($_POST['rotation']) ? intval($_POST['rotation']) : 0;
if ($rotation > 0) {
    // Create image resource based on file type
    switch ($file_type) {
        case 'image/jpeg':
            $source = imagecreatefromjpeg($file_tmp);
            break;
        case 'image/png':
            $source = imagecreatefrompng($file_tmp);
            break;
        case 'image/gif':
            $source = imagecreatefromgif($file_tmp);
            break;
        default:
            $source = null;
    }
    
    if ($source) {
        // Rotate the image
        $rotated = imagerotate($source, -$rotation, 0);
        
        // Save the rotated image
        switch ($file_type) {
            case 'image/jpeg':
                imagejpeg($rotated, $file_tmp, 90);
                break;
            case 'image/png':
                imagepng($rotated, $file_tmp, 9);
                break;
            case 'image/gif':
                imagegif($rotated, $file_tmp);
                break;
        }
        
        // Free up memory
        imagedestroy($source);
        imagedestroy($rotated);
    }
}

// Upload the file
if (move_uploaded_file($file_tmp, $upload_path)) {
    // Find and delete previous profile image
    $sql = "SELECT profile_image FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $old_image = $row['profile_image'];
        if ($old_image && $old_image != 'profile.svg' && file_exists($upload_dir . $old_image)) {
            unlink($upload_dir . $old_image);
        }
    }
    
    // Update the user's profile image in the database
    $sql = "UPDATE users SET profile_image = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $unique_filename, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Profile image uploaded successfully', 
            'image_path' => '../Uploads/profile_images/' . $unique_filename
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database update failed: ' . $stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
}

// Close the database connection
$stmt->close();
$conn->close();
?>