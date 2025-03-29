<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = '';
$dbname = "bondvoyage_db";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch feedback data
$sql = "SELECT id, name, email, feedback, submitted_at FROM feedback";
$result = $conn->query($sql);

$feedbacks = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $feedbacks[] = $row;
    }
    echo json_encode($feedbacks);
} else {
    echo json_encode([]);
}

$conn->close();
?>
