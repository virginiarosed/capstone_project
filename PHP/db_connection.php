<?php
// db_connection.php
$servername = "localhost";
$username = "root"; 
$password = '';  
$dbname = "bondvoyage_db";

$conn = new mysqli($servername, $username, $password, $dbname, 3306);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
