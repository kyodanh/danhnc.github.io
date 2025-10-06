// Authentication Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Wait for Firebase to load
    if (typeof firebase === 'undefined' || !window.firebaseAuth) {
        console.error('Firebase not loaded!');
        if (errorMessage) {
            errorMessage.textContent = 'Lỗi tải Firebase. Vui lòng refresh trang.';
            errorMessage.style.display = 'block';
        }
        return;
    }

    // Check if already logged in
    firebaseAuth.onAuthStateChanged(user => {
        if (user && window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-dashboard.html';
        } else if (!user && window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'admin-login.html';
        }
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btnText = document.querySelector('.btn-text');
            const btnLoader = document.querySelector('.btn-loader');
            const submitBtn = document.querySelector('.btn-login');

            // Show loading
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            submitBtn.disabled = true;
            errorMessage.style.display = 'none';

            try {
                await firebaseAuth.signInWithEmailAndPassword(email, password);
                window.location.href = 'admin-dashboard.html';
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = getErrorMessage(error.code);
                errorMessage.style.display = 'block';

                // Hide loading
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});

// Error message helper
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/invalid-email': 'Email không hợp lệ',
        'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
        'auth/user-not-found': 'Email hoặc mật khẩu không đúng',
        'auth/wrong-password': 'Email hoặc mật khẩu không đúng',
        'auth/too-many-requests': 'Quá nhiều lần thử. Vui lòng thử lại sau',
        'auth/network-request-failed': 'Lỗi kết nối mạng'
    };

    return errorMessages[errorCode] || 'Đã có lỗi xảy ra. Vui lòng thử lại';
}
