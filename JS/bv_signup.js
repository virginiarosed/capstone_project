// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.querySelector('input[name="password"]');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

document.getElementById('togglePasswordConfirmation').addEventListener('click', function () {
    const passwordConfirmationInput = document.querySelector('input[name="password_confirmation"]');
    const type = passwordConfirmationInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordConfirmationInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// Password Validation
const passwordInput = document.getElementById("password");
const passwordConfirmationInput = document.getElementById("password_confirmation");
const requirementList = document.querySelectorAll(".requirement-list li");

// Password requirements validation
const requirements = [
    { regex: /.{8,}/, index: 0 }, // At least 8 characters
    { regex: /[0-9]/, index: 1 }, // At least one number
    { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
    { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
    { regex: /[A-Z]/, index: 4 } // At least one uppercase letter
];

// Show password requirements when password input is focused
passwordInput.addEventListener("focus", function () {
    document.getElementById("password-requirements").style.display = 'block';
});

// Hide password requirements when focus is lost
passwordInput.addEventListener("blur", function () {
    document.getElementById("password-requirements").style.display = 'none';
});

passwordInput.addEventListener("keyup", function () {
    requirements.forEach(item => {
        const isValid = item.regex.test(passwordInput.value);
        const requirementItem = requirementList[item.index];
        if (isValid) {
            requirementItem.classList.add("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-check";
        } else {
            requirementItem.classList.remove("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-circle";
        }
    });
});

// Show Password Requirements when clicking "Next"
function showSecurityQuestions() {
    const password = document.querySelector('input[name="password"]').value;
    const passwordConfirmation = document.querySelector('input[name="password_confirmation"]').value;
    const passwordError = document.getElementById('password-error');
    
    // Check if passwords match
    if (password !== passwordConfirmation) {
        passwordError.style.display = 'block'; // Show error message if passwords don't match
        return; // Prevent transition to next section if passwords don't match
    }

    passwordError.style.display = 'none'; // Hide error message if passwords match

    // Check if the password meets all the criteria
    const isPasswordValid = requirements.every(item => item.regex.test(password));

    // Display the password requirements if password is invalid
    if (!isPasswordValid) {
        document.getElementById('password-requirements').style.display = 'block'; // Show requirement list if invalid
    } else {
        document.getElementById('password-requirements').style.display = 'none'; // Hide requirement list if valid
    }

    // Prevent moving to next section if password is invalid
    if (!isPasswordValid) {
        return; // Don't proceed to the next section if password is invalid
    }

    // Check if the birthday error is displayed
    const birthdayErrorDiv = document.getElementById('birthday-error');
    if (birthdayErrorDiv.style.display === 'block') {
        return; // Prevent moving to next section if birthday error is visible
    }

    // Move to the next section if everything is valid
    document.getElementById('initial-questions').style.display = 'none';
    document.getElementById('security-questions').style.display = 'block';
    document.querySelector('.signup-form-container').classList.add('widened'); // Increase width
}

// Check password validity when the user types in the confirmation password field
passwordConfirmationInput.addEventListener("keyup", checkPasswordValidity);

// Check password validity for confirmation field
function checkPasswordValidity() {
    const password = passwordInput.value;
    const passwordConfirmation = passwordConfirmationInput.value;
    const passwordError = document.getElementById('password-error');
    
    if (password !== passwordConfirmation) {
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }
}

const emailInput = document.getElementById('email');
const emailIcon = document.querySelector('.email-icon');

emailInput.addEventListener('input', function () {
    const emailValue = emailInput.value;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Email validation regex

    if (regex.test(emailValue)) {
        emailIcon.classList.remove('fa-envelope');    // Remove default envelope icon
        emailIcon.classList.add('fa-check-circle');  // Add check-circle icon
        emailIcon.style.color = '#585D27';            // Change icon color to green (valid)
    } else {
        emailIcon.classList.remove('fa-check-circle'); // Remove check-circle icon
        emailIcon.classList.add('fa-envelope');        // Add default envelope icon
        emailIcon.style.color = 'red';                  // Change icon color to red (invalid)
    }
});

// Go Back to Initial Questions
function goBackToInitial() {
    document.getElementById('initial-questions').style.display = 'block';
    document.getElementById('security-questions').style.display = 'none';
    document.querySelector('.signup-form-container').classList.remove('widened'); // Revert width
}

// Toggle the visibility of the input field for security question answers
function toggleSecurityQuestionInput(questionNumber) {
    const selectElement = document.getElementById(`security_question_${questionNumber}`);
    const answerContainer = document.getElementById(`security_answer_${questionNumber}_container`);
    const answerInput = document.getElementById(`security_answer_${questionNumber}`);

    // Always display the answer input when a question is selected
    if (selectElement.value) {
        answerContainer.style.display = 'block';
        answerInput.style.display = 'block';
    } else {
        answerContainer.style.display = 'none';
        answerInput.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Get today's date and calculate the maximum allowed date
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    const formattedMaxDate = maxDate.toISOString().split('T')[0];

    // Set the max attribute for the input field
    const birthdayInput = document.getElementById('birthday');
    birthdayInput.setAttribute('max', formattedMaxDate);

    // Add event listener for real-time validation
    birthdayInput.addEventListener('input', function () {
        const birthdayErrorDiv = document.getElementById('birthday-error');
        const selectedDate = new Date(this.value);

        // Show error if the selected date is invalid
        if (this.value && selectedDate > maxDate) {
            birthdayErrorDiv.style.display = 'block';
        } else {
            birthdayErrorDiv.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email'); // Assuming the email input has id="email"
    const emailErrorDiv = document.getElementById('email-error');

    // Event listener for real-time email validation
    emailInput.addEventListener('input', function () {
        const email = this.value;

        if (email) {
            // Make an AJAX request to check if the email exists in the database
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '../PHP/check_email.php', true); // check_email.php will handle the database query
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);

                    // If the email exists in the database
                    if (response.exists) {
                        emailErrorDiv.style.display = 'block'; // Show error message
                    } else {
                        emailErrorDiv.style.display = 'none'; // Hide error message
                    }
                }
            };
            xhr.send('email=' + encodeURIComponent(email)); // Send email to the server
        } else {
            emailErrorDiv.style.display = 'none'; // Hide the error message if the field is empty
        }
    });
});

const mobileInput = document.querySelector('input[name="mobile"]');
const mobileErrorDiv = document.getElementById('mobile-error');

mobileInput.addEventListener('input', function () {
    const mobileValue = this.value.trim(); // Remove spaces only from ends of the input
    const mobileRegex = /^09\d{9}$/;  // Regular expression to match 09*********
    const invalidCharsRegex = /[^0-9]/; // Regex to match any non-numeric character

    // Check if the input contains spaces or starts with '+'
    if (mobileValue.startsWith('+') || /\s/.test(mobileValue)) {
        mobileErrorDiv.style.display = 'block'; // Show error if it contains spaces or starts with '+'
    } else if (invalidCharsRegex.test(mobileValue)) {
        // Show error if any non-numeric characters are entered
        mobileErrorDiv.style.display = 'block';
    } else if (mobileValue.length === 11) {
        // After exactly 11 characters, validate the format
        if (!mobileRegex.test(mobileValue)) {
            mobileErrorDiv.style.display = 'block'; // Show error if invalid format
        } else {
            mobileErrorDiv.style.display = 'none'; // Hide error if format is valid
        }
    } else if (mobileValue.length > 11 && mobileValue.length <= 12) {
        // If the input has 12 characters (including spaces)
        mobileErrorDiv.style.display = 'block'; // Show error if input is more than 10 but less than or equal to 11 characters
    } else {
        mobileErrorDiv.style.display = 'none'; // Hide error if less than 10 characters
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const securityQuestionErrorDiv = document.getElementById('security-question-error');
    
    const questionSelectors = [
        document.getElementById('security_question_1'),
        document.getElementById('security_question_2'),
        document.getElementById('security_question_3')
    ];

    // Add event listeners to each select element for security questions
    questionSelectors.forEach((selector, index) => {
        selector.addEventListener('change', function () {
            checkForDuplicateQuestions();
        });
    });

    function checkForDuplicateQuestions() {
        // Get the selected questions (values of the <select> elements)
        const selectedQuestions = questionSelectors.map(selector => selector.value);

        // If less than 2 questions are selected, don't show the error
        if (selectedQuestions.filter(question => question !== "").length < 2) {
            securityQuestionErrorDiv.style.display = 'none';  // Hide error if less than two questions are chosen
            return;
        }

        // Check for duplicates among the selected questions
        const uniqueQuestions = new Set(selectedQuestions);

        // If the number of unique questions is less than the number of selected questions, show the error
        if (uniqueQuestions.size !== selectedQuestions.length) {
            securityQuestionErrorDiv.style.display = 'block';  // Show error if duplicates exist
        } else {
            securityQuestionErrorDiv.style.display = 'none';   // Hide error if no duplicates
        }
    }
});


document.querySelector('.signup-button').addEventListener('click', function (event) {
    if (securityQuestionErrorDiv.style.display === 'block') {
        event.preventDefault(); // Prevent form submission if there are errors
    }
});