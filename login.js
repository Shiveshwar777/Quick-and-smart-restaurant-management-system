document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (username.value.trim() === '') {
        document.getElementById('usernameError').style.display = 'block';
        username.classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('usernameError').style.display = 'none';
        username.classList.remove('is-invalid');
    }

    if (password.value.trim() === '') {
        document.getElementById('passwordError').style.display = 'block';
        password.classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('passwordError').style.display = 'none';
        password.classList.remove('is-invalid');
    }

    if (isValid) {
        alert('Sign in successful!');
        window.location.href = 'index.html';
    }
});

// Clear error messages
document.getElementById('username').addEventListener('input', function() {
    document.getElementById('usernameError').style.display = 'none';
    this.classList.remove('is-invalid');
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('passwordError').style.display = 'none';
    this.classList.remove('is-invalid'); 
});