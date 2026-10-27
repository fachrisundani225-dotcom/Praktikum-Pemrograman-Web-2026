// ==========================================
// File: main.js
// Logika Data, Form, Pencarian, dan Aksi Kartu
// ==========================================

// 1. Data proyek
let projects = [
    { id: 1, title: "Sistem Inventaris Keuangan", category: "Web App", budget: 2500000, completed: true },
    { id: 2, title: "Sistem Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
    { id: 3, title: "Landing Page Profil Perusahaan", category: "Web App", budget: 1500000, completed: false },
    { id: 4, title: "Aplikasi Presensi GPS Mobile", category: "Mobile App", budget: 45000000, completed: false }
];

// State filter aktif (dipakai bersama oleh pencarian & tombol kategori)
let activeCategory = "Semua";
let searchKeyword = "";

// 2. Format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

// Mencegah HTML/script dari input pengguna dieksekusi lewat innerHTML
const escapeHTML = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
};

// 3. Statistik (dihitung dari seluruh proyek, bukan hasil filter)
const updateStats = (dataList) => {
    const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
    const completedCount = dataList.filter((item) => item.completed).length;

    document.getElementById("stat-total-projects").textContent = dataList.length;
    document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
    document.getElementById("stat-completed-projects").textContent = completedCount;
};

// 4. Render daftar proyek
const renderProjects = (filteredList) => {
    const container = document.getElementById("project-list");
    if (!container) return;

    if (filteredList.length === 0) {
        container.innerHTML = `<p class="empty-message">Tidak ada proyek yang cocok.</p>`;
        return;
    }

    container.innerHTML = filteredList.map((proj) => {
        const badgeClass = proj.completed ? "badge-success" : "badge-pending";
        const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

        return `
            <div class="project-card">
                <div class="project-info">
                    <span class="project-category">${escapeHTML(proj.category)}</span>
                    <h4>${escapeHTML(proj.title)}</h4>
                    <p class="project-budget">${formatRupiah(proj.budget)}</p>
                </div>

                <div class="project-side">
                    <span class="badge ${badgeClass}">${statusText}</span>
                    <div class="card-actions">
                        <button class="btn-action btn-toggle" data-action="toggle" data-id="${proj.id}">Ubah Status</button>
                        <button class="btn-action btn-delete" data-action="delete" data-id="${proj.id}">Hapus Proyek</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
};

// 5. Filter terpadu: kategori + kata kunci pencarian
const getFilteredProjects = () => {
    return projects
        .filter((p) => activeCategory === "Semua" || p.category === activeCategory)
        .filter((p) => p.title.toLowerCase().includes(searchKeyword.toLowerCase()));
};

// Render ulang daftar + statistik
const refreshView = () => {
    renderProjects(getFilteredProjects());
    updateStats(projects);
};

// 6. Inisialisasi dan event listener
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("project-form");
    const inputTitle = document.getElementById("input-title");
    const inputCategory = document.getElementById("input-category");
    const inputBudget = document.getElementById("input-budget");
    const inputCompleted = document.getElementById("input-completed");
    const formError = document.getElementById("form-error");
    const searchInput = document.getElementById("search-input");
    const projectList = document.getElementById("project-list");
    const filterButtons = document.querySelectorAll(".btn-filter");

    refreshView();

    // Fitur 1: submit form
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = inputTitle.value.trim();
        const budget = Number(inputBudget.value);

        // Validasi
        if (title === "") {
            formError.textContent = "Judul proyek tidak boleh kosong.";
            inputTitle.focus();
            return;
        }
        if (!(budget > 0)) {
            formError.textContent = "Estimasi anggaran harus lebih besar dari 0.";
            inputBudget.focus();
            return;
        }
        formError.textContent = "";

        const newProject = {
            id: Date.now(),
            title: title,
            category: inputCategory.value,
            budget: budget,
            completed: inputCompleted.checked
        };

        // Spread operator
        projects = [...projects, newProject];

        form.reset();
        refreshView();
    });

    // Fitur 2: pencarian real-time
    searchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value.trim();
        refreshView();
    });

    // Filter kategori (tetap digabung dengan kata kunci pencarian)
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            e.currentTarget.classList.add("active");

            activeCategory = e.currentTarget.getAttribute("data-category");
            refreshView();
        });
    });

    // Fitur 3: aksi kartu (event delegation, karena kartu dibuat dinamis)
    projectList.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        const id = Number(btn.dataset.id);

        if (btn.dataset.action === "toggle") {
            projects = projects.map((p) =>
                p.id === id ? { ...p, completed: !p.completed } : p
            );
        } else if (btn.dataset.action === "delete") {
            projects = projects.filter((p) => p.id !== id);
        }

        refreshView();
    });
});