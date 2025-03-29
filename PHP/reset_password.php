<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get new password and email
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    $email = $_POST['email'];

    // Check if both passwords match
    if ($new_password === $confirm_password) {
        // Encrypt the new password
        $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
       
        include('../PHP/db_connection.php');

        // Update password in the database
        $email = $conn->real_escape_string($email);
        $sql = "UPDATE users SET password = '$hashed_password' WHERE email = '$email'";

        if ($conn->query($sql) === TRUE) {
            $message = 'Password has been reset successfully. <br> You can now <a href="/for_project/User_HTML/bv_login.html">log in</a> with your new password.';
            $button_text = 'Log In';
            $button_link = '/for_project/User_HTML/bv_login.html';
        } else {
            $message = 'Error updating password: ' . $conn->error;
            $button_text = 'Try Again';
            $button_link = 'javascript:history.back()'; // Go back to the previous page
        }

        $conn->close();
    } else {
        $message = 'Passwords do not match. Please try again.';
        $button_text = 'Try Again';
        $button_link = 'javascript:history.back()'; // Go back to the previous page
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BondVoyage │ Reset Password</title>
    <link rel="icon" href="../Images/favicon-32x32.png" type="image/png">
    <style>
        @font-face {
    font-family: 'Montserrat-Regular';
    src: url('../Fonts/Montserrat-Regular.ttf') format('truetype');
}

        @font-face {
            font-family: 'Gusto-Bold';
            src: url('../Fonts/Gusto-Bold.ttf') format('truetype');
        }

        @font-face {
            font-family: 'Montserrat-Medium';
            src: url('../Fonts/Montserrat-Medium.ttf') format('truetype');
        }

        @font-face {
            font-family: 'Montserrat-Bold';
            src: url('../Fonts/Montserrat-Bold.ttf') format('truetype');
        }
        
        body {
            font-family: 'Montserrat-Regular', sans-serif;
            ackground-image: url('../Images/bv_signupbg.png');
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background: #FFF0D9;
            padding: 20px;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            border: 8px solid #585D27;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .logo-container {
            display: flex;
            justify-content: center;  
            align-items: center;      
            margin-bottom: 5px;
        }

        .logo {
            max-width: 150px;
            width: 100%;  
        }

        h1 {
            text-align: center;
            font-family: 'Gusto-Bold', sans-serif;
            font-size: 55px;
            color: #585D27;
            margin: 10px 0;
            padding: 0;
        }

        p {
            font-size: 16px;
            color: #333;
            font-family: 'Montserrat-Regular', sans-serif;
        }

        .message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-family: 'Montserrat-Regular', sans-serif;
            text-align: center;
        }

        .error {
            background-color: #f8d7da;
            color: #721c24;
        }

        a {
            color: #585D27;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        button {
            padding: 10px;
            background-color: #585D27;
            color: white;
            font-family: 'Montserrat-Medium', sans-serif;
            font-size: 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 30%;
            margin: 0 auto;
            display: block;
            text-align: center;
        }

        button:hover {
            background-color: #2B2414;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="logo-container">
        <img src="../Images/bv_logo.png" alt="Logo" class="logo">
    </div>

    <h1>Reset Password</h1>

    <?php if (isset($message)): ?>
        <div class="message <?php echo (strpos($message, 'Error') === false) ? '' : 'error'; ?>">
            <?php echo $message; ?>
        </div>

        <!-- Display corresponding button -->
        <button onclick="window.location.href='<?php echo $button_link; ?>'">
            <?php echo $button_text; ?>
        </button>
    <?php endif; ?>
</div>

</body>
</html>
