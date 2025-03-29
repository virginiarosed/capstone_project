<?php

include('../PHP/db_connection.php');

// Pagination settings
$limit = 7; // Number of users per page
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1; // Get current page, default to 1
$offset = ($page - 1) * $limit; // Calculate offset

// Search query and sort option
$search = isset($_GET['search']) ? "%" . $conn->real_escape_string($_GET['search']) . "%" : '%';
$sort = isset($_GET['sort']) && $_GET['sort'] === 'oldest' ? 'ASC' : 'DESC';

// Get the date range from the GET parameters
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : null;
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : null;

// If both dates are provided, add the date range filter to the query
$date_filter = '';
if ($start_date && $end_date) {
    // Ensure the end_date includes all of the day (up to 23:59:59)
    $end_date = $end_date . ' 23:59:59'; // Add time to end_date
    $date_filter = "AND created_at BETWEEN ? AND ?";
}

// Fetch data from the "users" table with search, sort, LIMIT, OFFSET, and date filter
$sql = "SELECT id, first_name, last_name, email, mobile, created_at 
        FROM users 
        WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) 
        $date_filter
        ORDER BY created_at $sort 
        LIMIT $limit OFFSET $offset";

$stmt = $conn->prepare($sql);

// Bind parameters based on whether the date filter is present
if ($date_filter) {
    $stmt->bind_param("sssss", $search, $search, $search, $start_date, $end_date);
} else {
    $stmt->bind_param("sss", $search, $search, $search);
}

$stmt->execute();
$result = $stmt->get_result();

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Format created_at to mm/dd/yyyy hh:mm:ss
        $created_at = new DateTime($row['created_at']);
        $row['created_at'] = $created_at->format('m/d/Y h:i:s A'); // Format as mm/dd/yyyy hh:mm:ss AM/PM
        $users[] = $row;
    }
} else {
    $users = []; // Empty array if no results found
}

// Get the total number of users for pagination
$sql_total = "SELECT COUNT(*) as total FROM users WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) $date_filter";
$stmt_total = $conn->prepare($sql_total);
if ($date_filter) {
    $stmt_total->bind_param("sssss", $search, $search, $search, $start_date, $end_date);
} else {
    $stmt_total->bind_param("sss", $search, $search, $search);
}
$stmt_total->execute();
$total_result = $stmt_total->get_result();
$total_row = $total_result->fetch_assoc();
$total_users = $total_row['total'];
$total_pages = ceil($total_users / $limit); // Calculate total pages

// Return data as JSON
echo json_encode(['users' => $users, 'total_pages' => $total_pages]);

$conn->close();
?>
