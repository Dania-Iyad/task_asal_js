document.addEventListener("DOMContentLoaded", () => {

    var todoForm = document.getElementById("todoForm");
    var todoInput = document.getElementById("todo-text");
    var errorMessage = document.getElementById("errorMessage");
    var todoItems = document.getElementById("todoItems");

    var renamePopup = document.getElementById("rename-message");
    var renameInput = document.getElementById("renameInput");
    var saveRenameBtn = document.getElementById("saveRename");
    var cancelRenameBtn = document.getElementById("cancelRename");

    var deletePopup = document.getElementById("icon-message");
    var confirmDeleteBtn = document.getElementById("confirmDelete");
    var cancelDeleteBtn = document.getElementById("cancelDelete");

    var deleteDoneTasks = document.getElementById("deleteDoneTasks");
    var deleteAllTasks = document.getElementById("deleteAllTasks");

    var todos = JSON.parse(localStorage.getItem("todos")) || [];
    var indexToRename = null;
    var indexToDelete = null;
    var currentFilter = "all";
    var deleteType = null;

    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    function showTodos() {
        todoItems.innerHTML = "";

        todos.forEach((todo, index) => {

            if (currentFilter === "done" && !todo.done) return;
            if (currentFilter === "todo" && todo.done) return;

            var li = document.createElement("li");
            li.className = "todo-item";

            var span = document.createElement("span");
            span.textContent = todo.text;
            span.style.textDecoration = todo.done ? "line-through" : "none";
            span.style.color = todo.done ? "red" : "black";

            var actions = document.createElement("div");

            var checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = todo.done;

if (todo.done) {
    checkbox.classList.add("checked");
}

checkbox.onclick = () => {
    todo.done = !todo.done;

    if (todo.done) {
        checkbox.classList.add("checked");
    } else {
        checkbox.classList.remove("checked");
    }

    saveTodos();
    showTodos();
};


            var editIcon = document.createElement("i");
            editIcon.className = "fa-solid fa-pen";
            editIcon.onclick = () => {
                renamePopup.style.display = "flex";
                renameInput.value = todo.text;
                indexToRename = index;
            };

            var deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash";
            deleteIcon.onclick = () => {
                deletePopup.style.display = "flex";
                indexToDelete = index;
                deleteType = "one";
            };

            actions.append(checkbox, editIcon, deleteIcon);
            li.append(span, actions);
            todoItems.appendChild(li);
        });
    }

    todoForm.onsubmit = e => {
        e.preventDefault();
        var text = todoInput.value.trim();

        if (text === "") {
            errorMessage.innerText = "Task cannot be empty";
            errorMessage.classList.add("show");
            return;
        }

        if (text[0] >= '0' && text[0] <= '9') {
            errorMessage.innerText = "Task cannot start with number";
            errorMessage.classList.add("show");
            return;
        }

        if (text.length < 5) {
            errorMessage.innerText = "Task must be at least 5 characters long";
            errorMessage.classList.add("show");
            return;
        }

        errorMessage.textContent = "";
        todos.push({ text, done: false });
        saveTodos();
        showTodos();
        todoInput.value = "";
    };

    saveRenameBtn.onclick = () => {
        todos[indexToRename].text = renameInput.value;
        saveTodos();
        showTodos();
        renamePopup.style.display = "none";
    };

    cancelRenameBtn.onclick = () => renamePopup.style.display = "none";

    confirmDeleteBtn.onclick = () => {
        if (deleteType === "one") {
            todos.splice(indexToDelete, 1);
        }

        if (deleteType === "done") {
            todos = todos.filter(t => !t.done);
        }

        if (deleteType === "all") {
            todos = [];
        }

        saveTodos();
        showTodos();
        deletePopup.style.display = "none";
        deleteType = null;
    };


    cancelDeleteBtn.onclick = () => {
        deletePopup.style.display = "none";
        deleteType = null;
    };

    deleteDoneTasks.onclick = () => {
        deletePopup.style.display = "flex";
        deleteType = "done";
    };


    deleteAllTasks.onclick = () => {
        deletePopup.style.display = "flex";
        deleteType = "all";
    };


    document.querySelector('[data-filter="all"]').onclick = () => {
        currentFilter = "all";
        showTodos();
    };

    document.querySelector('[data-filter="done"]').onclick = () => {
        currentFilter = "done";
        showTodos();
    };

    document.querySelector('[data-filter="todo"]').onclick = () => {
        currentFilter = "todo";
        showTodos();
    };

    showTodos();
});