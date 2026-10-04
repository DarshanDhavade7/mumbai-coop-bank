document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const usernameInput = document.querySelector('input[type="text"]') || document.getElementById('username');
            const username = usernameInput ? usernameInput.value.trim() : '';

            if (username === 'admin') {
                window.location.href = 'admin-dashboard.html';
                return;
            }

            window.location.href = 'customer-dashboard.html';
        });
    });
});
