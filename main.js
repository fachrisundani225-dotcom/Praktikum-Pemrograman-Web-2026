// ==========================================
// File: main.js
// Integrasi Logika Data dan Render ke DOM
// ==========================================

// 1. Data proyek
const projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 45000000,
        completed: false
    }
];

// 2. Format angka menjadi mata uang Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

// 3. Memperbarui statistik proyek
const updateStats = (dataList) => {
    const totalProjects = dataList.length;

    const totalBudget = dataList.reduce(
        (acc, curr) => acc + curr.budget,
        0
    );

    const completedCount = dataList.filter(
        (item) => item.completed
    ).length;

    document.getElementById("stat-total-projects").textContent =
        totalProjects;

    document.getElementById("stat-total-budget").textContent =
        formatRupiah(totalBudget);

    document.getElementById("stat-completed-projects").textContent =
        completedCount;
};

// 4. Menampilkan daftar proyek ke DOM
const renderProjects = (filteredList) => {
    const container = document.getElementById("project-list");

    // Pastikan kontainer tersedia
    if (!container) return;

    // Tampilkan pesan jika tidak ada proyek
    if (filteredList.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                Tidak ada proyek pada kategori ini.
            </p>
        `;
        return;
    }

    // Membuat HTML untuk setiap proyek
    const htmlString = filteredList.map((proj) => {
        const badgeClass = proj.completed
            ? "badge-success"
            : "badge-pending";

        const statusText = proj.completed
            ? "Selesai"
            : "Dalam Pengerjaan";

        return `
            <div class="project-card">
                <div class="project-info">
                    <span class="project-category">
                        ${proj.category}
                    </span>

                    <h4>${proj.title}</h4>

                    <p class="project-budget">
                        ${formatRupiah(proj.budget)}
                    </p>
                </div>

                <div>
                    <span class="badge ${badgeClass}">
                        ${statusText}
                    </span>
                </div>
            </div>
        `;
    }).join("");

    // Memasukkan hasil render ke kontainer
    container.innerHTML = htmlString;
};

// 5. Inisialisasi halaman dan event listener
document.addEventListener("DOMContentLoaded", () => {

    // Tampilkan seluruh proyek saat halaman dibuka
    renderProjects(projects);

    // Tampilkan statistik awal
    updateStats(projects);

    // Ambil seluruh tombol filter
    const filterButtons = document.querySelectorAll(".btn-filter");

    // Tambahkan event listener pada setiap tombol
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {

            // Perbarui tombol yang aktif
            filterButtons.forEach((button) => {
                button.classList.remove("active");
            });

            e.currentTarget.classList.add("active");

            // Ambil kategori yang dipilih
            const selectedCategory =
                e.currentTarget.getAttribute("data-category");

            // Filter dan tampilkan proyek
            if (selectedCategory === "Semua") {
                renderProjects(projects);
            } else {
                const filtered = projects.filter(
                    (project) => project.category === selectedCategory
                );

                renderProjects(filtered);
            }
        });
    });
});
