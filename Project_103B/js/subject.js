let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let editId = 0;

const subjectTableBody = document.getElementById("subject-table-body");
const subjectNameInput = document.getElementById("subjectName");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const addSubjectModalElement = document.getElementById("addSubjectModal");
const submitBtn = addSubjectModalElement?.querySelector(".btn-primary");
const modalTitle = document.getElementById("addSubjectModalLabel");


let subjectIdToDelete = null;

addSubjectModalElement.addEventListener('shown.bs.modal', function () {
    subjectNameInput.focus();
});

subjectNameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        submitBtn.click();
    }
});

function showInputError(message) {
    const errorElement = document.getElementById("subjectNameError");
    if (errorElement) {
        errorElement.innerText = message;
        errorElement.style.display = "block";
        subjectNameInput.classList.add("is-invalid");
    }
}

function clearInputError() {
    const errorElement = document.getElementById("subjectNameError");
    if (errorElement) {
        errorElement.innerText = "";
        errorElement.style.display = "none";
        subjectNameInput.classList.remove("is-invalid");
    }
}

subjectNameInput.addEventListener("input", clearInputError);

function showToast(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true
    }).showToast();
}

function renderSubjects(data = subjects) {
    subjectTableBody.innerHTML = "";
    if (data.length === 0) {
        subjectTableBody.innerHTML = `<tr><td colspan="3" class="text-center" style="font-weight: bold; color: gray; padding: 20px;">Không tìm thấy môn học nào</td></tr>`;
        return;
    }

    data.forEach((subject) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="ps-4">${subject.name}</td>
            <td>
                <span class="${subject.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ● ${subject.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </span>
            </td>
            <td class="text-center">
                <button class="btn-action btn-delete" onclick="prepareDelete(${subject.id})">
                    <img src="../assets/icons/rubbish.svg" alt="delete">
                </button>
                <button class="btn-action btn-edit" onclick="startEditSubject(${subject.id})">
                    <img src="../assets/icons/pen.svg" alt="edit">
                </button>
            </td>`;
        subjectTableBody.appendChild(row);
    });
}

if (submitBtn) {
    submitBtn.addEventListener("click", function () {
        const name = subjectNameInput.value.trim();
        const status = document.querySelector('input[name="statusOptions"]:checked').value;

        clearInputError();

        if (!name) {
            showInputError("Vui lòng nhập tên môn học!");
            return;
        }

        const isDuplicate = subjects.some(s => {
            if (editId !== 0 && s.id === editId) return false;
            return s.name.toLowerCase().trim() === name.toLowerCase();
        });

        if (isDuplicate) {
            showInputError("Tên môn học này đã tồn tại!");
            return;
        }

        if (editId === 0) {
            subjects.unshift({ id: Date.now(), name: name, status: status });
            showToast("Thêm môn học thành công");
        } else {
            const index = subjects.findIndex(s => s.id === editId);
            if (index !== -1) {
                subjects[index].name = name;
                subjects[index].status = status;

                showToast("Cập nhật môn học thành công");
            }
            editId = 0;
        }

        localStorage.setItem("subjects", JSON.stringify(subjects));
        renderSubjects();

        const modalInstance = bootstrap.Modal.getInstance(addSubjectModalElement);
        modalInstance.hide();

        subjectNameInput.value = "";
        document.getElementById("statusActive").checked = true;
        modalTitle.innerText = "Thêm mới môn học";
        submitBtn.innerText = "Thêm";
    });
}

function startEditSubject(id) {
    const s = subjects.find(item => item.id === id);
    if (s) {
        clearInputError();

        editId = id;
        subjectNameInput.value = s.name;
        document.querySelector(`input[name="statusOptions"][value="${s.status}"]`).checked = true;

        modalTitle.innerText = "Cập nhật môn học";
        submitBtn.innerText = "Lưu thay đổi";

        let modalEl = document.getElementById('addSubjectModal');
        let modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.show();
    }
}

function handleFilter() {
    const keyword = searchInput.value.toLowerCase().trim();
    const statusValue = statusFilter.value;

    const filtered = subjects.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(keyword);

        const matchesStatus = (statusValue === "all") || (s.status === statusValue);

        return matchesSearch && matchesStatus;
    });

    renderSubjects(filtered);
}

if (searchInput) {
    searchInput.addEventListener("input", handleFilter);
}

if (statusFilter) {
    statusFilter.addEventListener("change", handleFilter);
}

function prepareDelete(id) {
    subjectIdToDelete = id;
    const subject = subjects.find(s => s.id === id);
    if (subject) {
        document.getElementById("deleteSubjectName").innerText = subject.name;
        new bootstrap.Modal(document.getElementById('deleteSubjectModal')).show();
    }
}

document.getElementById("confirmDeleteBtn")?.addEventListener("click", function () {
    if (subjectIdToDelete !== null) {
        subjects = subjects.filter(s => s.id !== subjectIdToDelete);

        localStorage.setItem("subjects", JSON.stringify(subjects));
        renderSubjects();

        showToast("Xóa môn học thành công");

        bootstrap.Modal.getInstance(document.getElementById('deleteSubjectModal')).hide();
        subjectIdToDelete = null;
    }
});

document.getElementById("confirmLogoutBtn")?.addEventListener("click", function () {
    sessionStorage.removeItem("currentUser");
    window.location.replace("../pages/login.html");
});

renderSubjects();