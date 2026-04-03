document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const lastNameInput = document.getElementById("lastName");
  const firstNameInput = document.getElementById("firstName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const termsCheckbox = document.getElementById("terms");

  const isValidEmail = (email) => {
    return email.includes("@") && email.includes(".");
  };

  const showError = (id, message) => {
    const errorSpan = document.getElementById(`error-${id}`);
    const input = document.getElementById(id);
    if (errorSpan) errorSpan.innerText = message;
    if (input) input.classList.add("input-error");
  };

  const clearErrors = () => {
    document.querySelectorAll(".error-message").forEach((el) => (el.innerText = ""));
    document.querySelectorAll("input").forEach((el) => el.classList.remove("input-error"));
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    let isValid = true;

    if (!lastNameInput.value.trim()) {
      showError("lastName", "Họ và tên không được để trống");
      isValid = false;
    }

    if (!firstNameInput.value.trim()) {
      showError("firstName", "Tên không được để trống");
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      showError("email", "Email không được để trống");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError("email", "Email phải đúng định dạng");
      isValid = false;
    }

    if (!passwordInput.value.trim()) {
      showError("password", "Mật khẩu không được để trống");
      isValid = false;
    } else if (passwordInput.value.length < 8) {
      showError("password", "Mật khẩu tối thiểu 8 ký tự");
      isValid = false;
    }

    if (!termsCheckbox.checked) {
      showError("terms", "Bạn phải đồng ý với điều khoản");
      isValid = false;
    }

    if (isValid) {
      const userData = {
        lastName: lastNameInput.value.trim(),
        firstName: firstNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value 
      };

      const users = JSON.parse(localStorage.getItem("users")) || [];

      users.push(userData);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Đăng ký thành công!");
      window.location.href = "./login.html";
    }
  });
});