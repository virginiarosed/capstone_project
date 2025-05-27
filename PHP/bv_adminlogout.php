<?php
session_start();

// Clear all admin session variables
unset($_SESSION['admin_logged_in']);
unset($_SESSION['admin_id']);
unset($_SESSION['admin_email']);
unset($_SESSION['admin_company_name']); // Updated session variable

// Destroy the session
session_destroy();

// Redirect to admin login page
header("Location: /capstone_project/Admin_HTML/bv_adminlogin.html");
exit();
?>