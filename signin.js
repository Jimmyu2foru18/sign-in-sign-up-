document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signin-form');
    
    if (signinForm) {
        signinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userInput = document.getElementById('user-input').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Simplified login - determine if input is email or username
            const isEmail = userInput.includes('@');
            
            try {
                // Simple fetch request to login endpoint
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        [isEmail ? 'email' : 'username']: userInput,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store token in localStorage for simplicity
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userName', data.name);
                    
                    alert('Login successful!');
                    window.location.href = 'landing.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed - please try again');
            }
        });
    }
    
    // Keep existing signOut function
    function signOut() {
        localStorage.clear(); // Clear all authentication-related data
        sessionStorage.clear(); // Clear any session data
        
        // Redirect to signin page
        const baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        window.location.href = baseUrl + 'signin.html';
        
        // Prevent any cached data from persisting
        if (window.history && window.history.pushState) {
            window.history.pushState('', document.title, window.location.pathname);
        }
    }
    
    // Expose signOut function globally if needed
    window.signOut = signOut;
});