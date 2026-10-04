document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (!loginForm) {
        console.error("loginForm element not found!");
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Page refresh hone se rokega

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        if (!username || !password) {
            messageDiv.className = 'mt-3 text-center text-danger fw-bold';
            messageDiv.innerText = 'Please fill in all fields!';
            return;
        }

        messageDiv.className = 'mt-3 text-center text-primary fw-bold';
        messageDiv.innerText = 'Connecting to server...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                messageDiv.className = 'mt-3 text-center text-success fw-bold';
                messageDiv.innerText = 'Login Successful! Redirecting...';
                
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                setTimeout(() => {
                    if (data.user && data.user.role === 'admin') {
                        window.location.href = '/admin-dashboard.html';
                    } else {
                        window.location.href = '/customer-dashboard.html';
                    }
                }, 1000);
            } else {
                messageDiv.className = 'mt-3 text-center text-danger fw-bold';
                messageDiv.innerText = data.error || 'Invalid credentials!';
            }
        } catch (err) {
            console.error('Login Error:', err);
            messageDiv.className = 'mt-3 text-center text-danger fw-bold';
            messageDiv.innerText = 'Server connection failed! Check terminal logs.';
        }
    });
});