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
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in'] || !isset($_SESSION['admin_id'])) {
    echo json_encode(['error' => 'Admin not logged in']);
    exit();
}

$admin_id = $_SESSION['admin_id'];

try {
    // Get admin data from database including password changed date
    $stmt = $pdo->prepare("SELECT company_name, email, profile_image, password_changed_date FROM admin WHERE admin_id = ?");
    $stmt->execute([$admin_id]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        // Format the password changed date for display
        if ($admin['password_changed_date']) {
            $date = new DateTime($admin['password_changed_date']);
            $admin['password_changed_date_formatted'] = $date->format('F j, Y \a\t g:i A');
        } else {
            $admin['password_changed_date_formatted'] = 'Never changed';
        }
        
        echo json_encode($admin);
    } else {
        echo json_encode(['error' => 'Admin not found']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>