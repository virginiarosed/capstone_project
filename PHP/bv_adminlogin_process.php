<?php
include('../PHP/db_connection.php');

// Get user input
$email = $_POST['email'];
$password = $_POST['password'];

// Query to check if email exists in admin table (renamed from admins)
$sql = "SELECT admin_id, company_name, email, password FROM admin WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $hashed_password_from_db = $row['password'];

    // Check if password is hashed with password_hash() or SHA256
    $password_verified = false;
    
    // First try password_verify() for bcrypt/password_hash() passwords
    if (password_verify($password, $hashed_password_from_db)) {
        $password_verified = true;
    } 
    // If that fails, try SHA256 hash for legacy passwords
    else {
        $hashed_input_password = hash('sha256', $password);
        if ($hashed_input_password === $hashed_password_from_db) {
            $password_verified = true;
            
            // Optionally upgrade to password_hash() for better security
            $new_hash = password_hash($password, PASSWORD_DEFAULT);
            $update_sql = "UPDATE admin SET password = ? WHERE admin_id = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("si", $new_hash, $row['admin_id']);
            $update_stmt->execute();
            $update_stmt->close();
        }
    }

    if ($password_verified) {
        // Start the session and set session variables
        session_start();
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $row['admin_id'];
        $_SESSION['admin_email'] = $row['email'];
        $_SESSION['admin_company_name'] = $row['company_name'];

        // Redirect to the admin dashboard
        header("Location: /capstone_project/Admin_HTML/bv_adminhome.html");
        exit();
    } else {
        // Invalid credentials
        header("Location: /capstone_project/Admin_HTML/bv_adminlogin.html?error=Invalid credentials");
        exit();
    }
} else {
    // Email not found
    header("Location: /capstone_project/Admin_HTML/bv_adminlogin.html?error=Invalid credentials");
    exit();
}

// Close the connection
$stmt->close();
$conn->close();
?>