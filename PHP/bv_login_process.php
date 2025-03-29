<?php
// Start session to handle session variables
session_start();

include('../PHP/db_connection.php');

// Check if the form is submitted using POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get the submitted email and password from the form
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'];  // Plain text password entered by the user

    // Query the database to check if the user exists
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    // Check if the email exists in the database
    if ($result->num_rows > 0) {
        // Fetch the user data from the database
        $user = $result->fetch_assoc();
        
        // Verify the password entered by the user against the hashed password in the database
        if (password_verify($password, $user['password'])) {
            // Password is correct, login successful
            
            // Set session variables to keep the user logged in
            $_SESSION['user_id'] = $user['id'];  // Assuming 'id' is the user's unique identifier in the database
            $_SESSION['email'] = $user['email']; // Store the user's email in session
            
            // Redirect to the home page (bv_home.html)
            header("Location: /for_project/User_HTML/bv_home.html");
            exit();
        } else {
            // Incorrect password
            $_SESSION['error_message'] = "Wrong password. Try again.";
            header("Location: /for_project/User_HTML/bv_login.html?error=" . urlencode($_SESSION['error_message']) . "&password_incorrect=true&email=" . urlencode($email));
            exit();
        }
    } else {
        // Email not found in the database
        $_SESSION['error_message'] = "Invalid email.";
        header("Location: /for_project/User_HTML/bv_login.html?error=" . urlencode($_SESSION['error_message']) . "&email=" . urlencode($email));
        exit();
    }

    // Close the database connection
    $conn->close();
} else {
    // Redirect to the login page if the form is not submitted
    header("Location: /for_project/User_HTML/bv_login.html");
    exit();
}
