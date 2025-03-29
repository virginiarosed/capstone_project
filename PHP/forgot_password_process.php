<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get user inputs
    $email = $_POST['email'];
    $security_question_1 = $_POST['security_question_1'];
    $security_answer_1 = $_POST['security_answer_1'];
    $security_question_2 = $_POST['security_question_2'];
    $security_answer_2 = $_POST['security_answer_2'];
    $security_question_3 = $_POST['security_question_3'];
    $security_answer_3 = $_POST['security_answer_3'];

    // Check if all fields are filled
    if (empty($email) || empty($security_answer_1) || empty($security_answer_2) || empty($security_answer_3)) {
        $error_message = "All fields are required!";
        header("Location: /for_project/User_HTML/bv_forgotpass.html?error=" . urlencode($error_message));
        exit;
    }

    include('../PHP/db_connection.php');

    // Fetch user record by email
    $email = $conn->real_escape_string($email);
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        
        $user = $result->fetch_assoc();

        // Validate security questions and answers
        if ($user['security_question_1'] === $security_question_1 &&
            password_verify($security_answer_1, $user['security_answer_1']) && // Verify hash for the first answer
            password_verify($security_answer_2, $user['security_answer_2']) && // Verify hash for the second answer
            password_verify($security_answer_3, $user['security_answer_3'])) {  // Verify hash for the third answer
                
            // Proceed to reset password form
            echo '
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BondVoyage │ Reset Password</title>
                <link rel="stylesheet" href="../CSS/forgot_password_process.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <link rel="icon" href="../Images/favicon-32x32.png" type="image/png">
            </head>
            <body>
                <form method="POST" action="../PHP/reset_password.php">
                    <div class="logo-container">
                        <img src="../Images/bv_logo.png" alt="Logo" class="logo">
                    </div>
                    <h1>Reset Password</h1>
                    <input type="hidden" name="email" value="' . $email . '">

                    <div class="password-container">
                        <label for="new_password">Enter New Password</label>
                        <input type="password" id="new_password" name="new_password" required>
                        <i class="fas fa-eye" id="toggleNewPassword" style="cursor: pointer;"></i>
                    </div>

                    <div class="password-container">
                        <label for="confirm_password">Confirm New Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" required>
                        <i class="fas fa-eye" id="toggleConfirmPassword" style="cursor: pointer;"></i>
                    </div>

                    <button type="submit" name="reset_password">Reset Password</button>
                </form>

                <script>
                    document.getElementById("toggleNewPassword").addEventListener("click", function () {
                        const passwordInput = document.getElementById("new_password");
                        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
                        passwordInput.setAttribute("type", type);
                        this.classList.toggle("fa-eye-slash");
                    });

                    document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
                        const passwordInput = document.getElementById("confirm_password");
                        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
                        passwordInput.setAttribute("type", type);
                        this.classList.toggle("fa-eye-slash");
                    });
                </script>
            </body>
            </html>';
        } else {
            $error_message = "Incorrect answers to the security questions. Please try again.";
            header("Location: /for_project/User_HTML/bv_forgotpass.html?error=" . urlencode($error_message));
            exit;
        }
    } else {
        $error_message = "Email not found. Please check your email and try again.";
        header("Location: /for_project/User_HTML/bv_forgotpass.html?error=" . urlencode($error_message));
        exit;
    }

    $conn->close();
}
?>