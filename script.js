document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    const MAX_TASKS = 5;
    const MIN_LENGTH = 3;

    const getTasks = () => {
        try {
            return JSON.parse(localStorage.getItem("todo_tasks")) || [];
        } catch {
            return [];
        }
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    const showError = (message) => {
        inputError.textContent = message;
        inputError.style.display = "block";
        taskInput.classList.add("error");
    };

    const hideError = () => {
        inputError.style.display = "none";
        taskInput.classList.remove("error");
    };

    // Fitur 1: perbarui penghitung tugas
    const updateCounter = (tasks) => {
        const total = tasks.length;
        const done = tasks.filter((t) => t.completed).length;
        const pending = total - done;

        taskCounter.textContent =
            `Total: ${total} Tugas | Selesai: ${done} | Belum Selesai: ${pending}`;
    };

    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";

        updateCounter(tasks);

        if (tasks.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "Belum ada tugas tersimpan.";
            empty.style.cssText =
                "text-align:center;color:#64748b;font-size:13px;padding:10px;";
            todoList.appendChild(empty);
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "todo-item" + (task.completed ? " completed" : "");

            const span = document.createElement("span");
            span.className = "todo-text";
            span.textContent = task.text; // aman dari XSS

            const actions = document.createElement("div");
            actions.className = "todo-actions";

            const completeBtn = document.createElement("button");
            completeBtn.type = "button";
            completeBtn.className = "action-btn complete-btn";
            completeBtn.dataset.index = index;
            completeBtn.textContent = task.completed ? "Batal" : "Selesai";

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "action-btn delete-btn";
            deleteBtn.dataset.index = index;
            deleteBtn.textContent = "Hapus";

            actions.append(completeBtn, deleteBtn);
            li.append(span, actions);
            todoList.appendChild(li);
        });
    };

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const tasks = getTasks();

        if (taskText.length < MIN_LENGTH) {
            showError("Tugas tidak boleh kosong atau kurang dari 3 karakter!");
            return;
        }

        if (tasks.length >= MAX_TASKS) {
            showError("Maksimal hanya 5 tugas!");
            return;
        }

        hideError();
        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);

        taskInput.value = "";
        renderTasks();
    });

    taskInput.addEventListener("input", hideError);

    todoList.addEventListener("click", (e) => {
        const target = e.target.closest("button[data-index]");
        if (!target) return;

        const index = Number(target.dataset.index);
        const tasks = getTasks();

        if (target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
        } else if (target.classList.contains("delete-btn")) {
            // Fitur 3: konfirmasi sebelum menghapus
            const yakin = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
            if (!yakin) return;

            tasks.splice(index, 1);
            hideError();
        }

        saveTasks(tasks);
        renderTasks();
    });

    // Fitur 2: hapus hanya tugas yang completed: true
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();
        const remaining = tasks.filter((task) => !task.completed);

        saveTasks(remaining);
        hideError();
        renderTasks();
    });

    renderTasks();
});