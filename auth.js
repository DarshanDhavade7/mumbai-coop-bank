document.addEventListener('DOMContentLoaded', () => {
    // Select all potential forms on the page
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Find input fields inside the submitted form
            const usernameInput = form.querySelector('input[type="text"], input[name="username"], #username');
            const passwordInput = form.querySelector('input[type="password"], input[name="password"], #password');

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            // Detect active tab/role
            const activeTab = document.querySelector('.nav-tabs .active, .tab.active, [data-role].active');
            let role = 'member';
            if (activeTab && activeTab.innerText.toLowerCase().includes('admin')) {
                role = 'admin';
            }

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role })
                });

                const data = await response.json();

                if (data.success) {
                    alert(data.message || 'Login Successful!');
                    window.location.href = data.redirect || (role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html');
                } else {
                    alert(data.message || 'Invalid Credentials');
                }
            } catch (error) {
                console.error('Login Error:', error);
                // Fallback for demo testing if API response fails
                if (username === 'user1' || username === 'admin') {
                    alert('Login Successful! (Demo Mode)');
                    window.location.href = username === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
                } else {
                    alert('Invalid Username or Password');
                }
            }
        });
    });
});
