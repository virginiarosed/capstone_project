<?php
header('Content-Type: application/json');
include('../PHP/db_connection.php');

$sql = "
    SELECT MONTH(created_at) AS month, COUNT(*) AS count
    FROM users
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at)
    ORDER BY MONTH(created_at)
";

$result = $conn->query($sql);
$data = array_fill(0, 12, 0); // Initialize with 12 months

while ($row = $result->fetch_assoc()) {
    $monthIndex = (int)$row['month'] - 1;
    $data[$monthIndex] = (int)$row['count'];
}

echo json_encode($data);
$conn->close();
?>
