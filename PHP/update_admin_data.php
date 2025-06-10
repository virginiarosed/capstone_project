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

// Validate input (changed from first_name and last_name to company_name)
if (!isset($_POST['company_name']) || !isset($_POST['email'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

$companyName = trim($_POST['company_name']);
$email = trim($_POST['email']);

// Validate data
if (empty($companyName) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

try {
    // Check if email is already used by another admin
    $stmt = $pdo->prepare("SELECT admin_id FROM admin WHERE email = ? AND admin_id != ?");
    $stmt->execute([$email, $admin_id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email is already in use by another admin']);
        exit();
    }
    
    // Update admin data (table renamed to 'admin' and using company_name)
    $stmt = $pdo->prepare("UPDATE admin SET company_name = ?, email = ? WHERE admin_id = ?");
    $stmt->execute([$companyName, $email, $admin_id]);
    
    if ($stmt->rowCount() > 0) {
        // Update session variable
        $_SESSION['admin_company_name'] = $companyName;
        $_SESSION['admin_email'] = $email;
        
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes were made']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>