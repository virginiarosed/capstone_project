<?php
include('../PHP/db_connection.php');

// Get user input
$email = $_POST['email'];
$password = $_POST['password'];

// Query to check if email exists
$sql = "SELECT password FROM admin_users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $hashed_password_from_db = $row['password'];

    // Hash input password with SHA2 to match database storage
    $hashed_input_password = hash('sha256', $password);

    if ($hashed_input_password === $hashed_password_from_db) {
        // Start the session and set session variables
        session_start();
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_email'] = $email;

        // Redirect to the admin dashboard
        header("Location: /for_project/Admin_HTML/bv_adminhome.html");
        exit();
    } else {
        // Invalid credentials
        header("Location: /for_project/Admin_HTML/bv_adminlogin.html?error=Invalid credentials");
        exit();
    }
} else {
    // Email not found
    header("Location: /for_project/Admin_HTML/bv_adminlogin.html?error=Invalid credentials");
    exit();
}

// Close the connection
$stmt->close();
$conn->close();
?>
