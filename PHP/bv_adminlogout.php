<?php
session_start(); // Start the session

// Destroy the session to log out the user
session_destroy();

// Redirect to the login page
header("Location: /for_project/Admin_HTML/bv_adminlogin.html");
exit();
?>
