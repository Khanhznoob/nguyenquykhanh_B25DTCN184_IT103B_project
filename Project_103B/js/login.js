const users = JSON.parse(localStorage.getItem("users")) || [];
const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const showLoginError = (id, message) => {
    const errorSpan = document.getElementById(`error-${id}`);
    const input = document.getElementById(id);
    if (errorSpan) errorSpan.innerText = message;
    if (input) input.classList.add("input-error");
};

const clearErrors = () => {
    document.querySelectorAll(".error-message").forEach(el => el.innerText = "");
    document.querySelectorAll("input").forEach(el => el.classList.remove("input-error"));
};

const clearInputError = (id) => {
    const errorSpan = document.getElementById(`error-${id}`);
    const input = document.getElementById(id);
    if (errorSpan) errorSpan.innerText = "";
    if (input) input.classList.remove("input-error");
};

emailInput.addEventListener("input", () => clearInputError("email"));
passwordInput.addEventListener("input", () => clearInputError("password"));
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;

    if (!emailValue) {
        showLoginError("email", "Vui lòng nhập email");
        return;
    }
    if (!passwordValue) {
        showLoginError("password", "Vui lòng nhập mật khẩu");
        return;
    }

    const user = users.find(u => u.email === emailValue);

    if (!user) {
        showLoginError("email", "Email này chưa được đăng ký.");
        return;
    }

    if (user.password !== passwordValue) {
        showLoginError("password", "Mật khẩu không chính xác.");
        return;
    }

    Toastify({
        text: " Đăng nhập thành công!",
        duration: 800,
        gravity: "top",
        position: "right",
        style: {
            background: "#00b09b",
            borderRadius: "8px"
        },
        callback: function () {
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "../pages/subject.html";
        }
    }).showToast();
});