const users = JSON.parse(localStorage.getItem("users")) || [];
const form = document.querySelector("form");
const lastNameInput = document.getElementById("lastName");
const firstNameInput = document.getElementById("firstName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const termsCheckbox = document.getElementById("terms");

const showError = (id, message) => {
  const errorSpan = document.getElementById(`error-${id}`);
  const input = document.getElementById(id);
  if (errorSpan) errorSpan.innerText = message;
  if (input) input.classList.add("input-error");
};

const clearInputError = (id) => {
  const errorSpan = document.getElementById(`error-${id}`);
  const input = document.getElementById(id);
  if (errorSpan) errorSpan.innerText = "";
  if (input) input.classList.remove("input-error");
};

form.addEventListener("input", (e) => {
  const targetId = e.target.id;
  if (targetId) {
    clearInputError(targetId);
  }
});

termsCheckbox.addEventListener("change", () => {
  if (termsCheckbox.checked) {
    clearInputError("terms");
  }
});

const isValidEmail = (email) => email.includes("@") && email.includes(".");

const clearAllErrors = () => {
  document.querySelectorAll(".error-message").forEach((el) => (el.innerText = ""));
  document.querySelectorAll("input").forEach((el) => el.classList.remove("input-error"));
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearAllErrors();

  const emailValue = emailInput.value.trim();
  let id = users.length !== 0 ? users[users.length - 1].id + 1 : 1;

  let userData = {
    id,
    lastName: lastNameInput.value.trim(),
    firstName: firstNameInput.value.trim(),
    email: emailValue,
    password: passwordInput.value
  };

  let isValid = true;

  if (!userData.lastName) {
    showError("lastName", "Họ và tên không được để trống");
    isValid = false;
  }

  if (!userData.firstName) {
    showError("firstName", "Tên không được để trống");
    isValid = false;
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    showError("email", "Email không hợp lệ");
    isValid = false;
  } else {
    const isEmailExist = users.some(user => user.email === emailValue);
    if (isEmailExist) {
      showError("email", "Email này đã được đăng ký.");
      isValid = false;
    }
  }

  if (userData.password.length < 8) {
    showError("password", "Mật khẩu tối thiểu 8 ký tự");
    isValid = false;
  }

  if (!termsCheckbox.checked) {
    showError("terms", "Bạn phải đồng ý với điều khoản");
    isValid = false;
  }

  if (isValid) {
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    Toastify({
      text: " Đăng ký thành công!",
      duration: 800,
      gravity: "top",
      position: "right",
      style: {
        background: "#00b09b",
        borderRadius: "8px"
      },
      callback: function () {
        window.location.href = "./login.html";
      }
    }).showToast();
  }
});