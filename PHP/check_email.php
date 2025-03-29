<?php
// check_email.php

// Include database connection
include('db_connection.php'); // Ensure you have the correct path to your DB connection file

// Check if email is provided in the request
if (isset($_POST['email'])) {
    $email = $conn->real_escape_string($_POST['email']);

    // Query the database to check if the email exists
    $sql = "SELECT COUNT(*) FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    // Get the number of rows matching the email
    $row = $result->fetch_row();

    // Send the response back to the client
    if ($row[0] > 0) {
        echo json_encode(['exists' => true]); // Email exists
    } else {
        echo json_encode(['exists' => false]); // Email does not exist
    }
}
?>
