<?php
include('../PHP/db_connection.php');

// Assuming you have a way to identify the logged-in user, e.g., through a session
session_start();
$user_id = $_SESSION['user_id']; // Replace with the actual user ID from the session

// Query to fetch user's details (first name, last name, and email)
$sql = "SELECT first_name, last_name, email FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id); // Bind the user ID
$stmt->execute();
$stmt->bind_result($first_name, $last_name, $email);
$stmt->fetch();

// Close the connection
$stmt->close();
$conn->close();
?>

<!-- HTML code to display the user's information -->
<div class="profile-right">
    <p class="profile-name"><?php echo $first_name . ' ' . $last_name; ?></p>
    <p class="profile-email"><?php echo $email; ?></p>
</div>
