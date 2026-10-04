document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                // Relative URL used to work on both Localhost & Render Live Server
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message || 'Login Successful!');
                    window.location.href = data.redirect || 'customer-dashboard.html';
                } else {
                    alert(data.message || 'Invalid Credentials');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Server Connection Error!');
            }
        });
    }
});
