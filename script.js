// LOAD SAVED DATA FROM LOCAL STORAGE
let todos = JSON.parse(localStorage.getItem("todoData") || "[]");

// Current Filter Selection
let filter = "all";

// SAVE DATA TO LOCAL STORAGE
function saveTodos() {
    localStorage.setItem("todoData", JSON.stringify(todos));
}

// DISPLAY TODOS ON SCREEN
function showTodos() {
    let list = document.getElementById("todoList");
    list.innerHTML = "";

    let filteredTodos = todos.filter(todo => {
        if (filter === "active" && todo.done) return false;
        if (filter === "completed" && !todo.done) return false;
        return true;
    });

    filteredTodos.forEach((todo, index) => {
        let row = document.createElement("div");
        row.className = "todo" + (todo.done ? " done" : "");
        row.draggable = true;
        row.setAttribute("data-index", index);

        row.innerHTML = `
            <input type="checkbox" data-id="${index}" ${todo.done ? "checked" : ""}>
            <span>${todo.text}</span>

            <button class="action-btn editBtn" data-id="${index}">Edit</button>
            <button class="action-btn deleteBtn" data-id="${index}">Delete</button>
        `;

        list.appendChild(row);
    });

    document.getElementById("itemsLeft").innerText =
        todos.filter(t => !t.done).length + " items left";

    saveTodos();
}

// ADD NEW TASK
document.getElementById("addBtn").onclick = function () {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if (text === "") return;

    todos.push({ text: text, done: false });
    input.value = "";
    showTodos();
};

// CHECKBOX, EDIT, DELETE BUTTON
document.addEventListener("click", function (e) {
    
    // Mark done / undone
    if (e.target.type === "checkbox") {
        let id = e.target.dataset.id;
        todos[id].done = !todos[id].done;
        showTodos();
    }

    // Delete item
    if (e.target.classList.contains("deleteBtn")) {
        let id = e.target.dataset.id;
        todos.splice(id, 1);
        showTodos();
    }

    // Edit item
    if (e.target.classList.contains("editBtn")) {
        let id = e.target.dataset.id;
        let newText = prompt("Edit Task:", todos[id].text);

        if (newText && newText.trim() !== "") {
            todos[id].text = newText.trim();
            showTodos();
        }
    }
});

// FILTER BUTTONS
document.getElementById("allBtn").onclick = function (e) {
    filter = "all";
    setActive(e);
    showTodos();
};
document.getElementById("activeBtn").onclick = function (e) {
    filter = "active";
    setActive(e);
    showTodos();
};
document.getElementById("completedBtn").onclick = function (e) {
    filter = "completed";
    setActive(e);
    showTodos();
};

function setActive(e) {
    document.querySelectorAll(".filter-btn").forEach(btn =>
        btn.classList.remove("active")
    );
    e.target.classList.add("active");
}

// CLEAR COMPLETED
document.getElementById("clearCompletedBtn").onclick = function () {
    todos = todos.filter(t => !t.done);
    showTodos();
};

// DRAG & DROP REORDER
let dragStartIndex = null;

document.addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("todo")) {
        dragStartIndex = e.target.dataset.index;
    }
});

document.addEventListener("dragover", function (e) {
    e.preventDefault();
});

document.addEventListener("drop", function (e) {
    if (e.target.classList.contains("todo")) {
        let dropIndex = e.target.dataset.index;
        let draggedItem = todos.splice(dragStartIndex, 1)[0];
        todos.splice(dropIndex, 0, draggedItem);
        showTodos();
    }
});

// FIRST DISPLAY
showTodos();
