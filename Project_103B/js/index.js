document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Reset lại toàn bộ thông báo lỗi và màu viền trước khi check
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

    // Hàm hỗ trợ để in lỗi ra giao diện cho gọn code
    function showError(inputId, message) {
        document.getElementById('error-' + inputId).textContent = message;
        document.getElementById(inputId).classList.add('input-error');
    }

    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    let isValid = true; // Biến cờ hiệu, nếu có bất kỳ lỗi nào sẽ chuyển thành false

    // 1. Kiểm tra Họ và tên
    if (!lastName) {
        showError('lastName', 'Họ đệm không được để trống');
        isValid = false;
    }
    if (!firstName) {
        showError('firstName', 'Tên không được để trống');
        isValid = false;
    }

    // 2 & 3. Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email', 'Email không được để trống');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Email phải đúng định dạng');
        isValid = false;
    }

    // 4 & 5. Kiểm tra Mật khẩu
    if (!password) {
        showError('password', 'Mật khẩu không được để trống');
        isValid = false;
    } else if (password.length < 8) {
        showError('password', 'Mật khẩu tối thiểu 8 ký tự');
        isValid = false;
    }

    // 6 & 7. Kiểm tra Xác nhận mật khẩu
    if (!confirmPassword) {
        showError('confirmPassword', 'Mật khẩu xác nhận không được để trống');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Mật khẩu không trùng khớp');
        isValid = false;
    }

    // 8. Kiểm tra Checkbox điều khoản
    if (!terms) {
        document.getElementById('error-terms').textContent = 'Bạn cần đồng ý với chính sách và điều khoản';
        isValid = false;
    }

    // Nếu form không hợp lệ (có lỗi) thì dừng function tại đây, không lưu data
    if (!isValid) return;

    // 9. Xử lý lưu trữ thông tin (LocalStorage)
    const newUser = {
        fullName: lastName + ' ' + firstName,
        email: email,
        password: password
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        showError('email', 'Email này đã được đăng ký!');
        return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 10. Chuyển hướng khi thành công
    alert("Đăng ký tài khoản thành công!"); // Báo thành công thì dùng alert là hợp lý rồi
    window.location.href = './login.html'; 
});