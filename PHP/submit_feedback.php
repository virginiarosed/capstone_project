<?php
include('../PHP/db_connection.php');

// Get the form data
$name = $_POST['name'];
$email = $_POST['email'];
$feedback = $_POST['feedback'];

// Prepare and bind the SQL statement
$stmt = $conn->prepare("INSERT INTO feedback (name, email, feedback) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $feedback);

// Execute the statement
if ($stmt->execute()) {
    echo "Feedback submitted successfully!";
} else {
    echo "Error: " . $stmt->error;
}

// Close the connection
$stmt->close();
$conn->close();
?>
