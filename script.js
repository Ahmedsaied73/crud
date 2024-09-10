let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        readTasks();
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
});

function createTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        saveTasks();
        readTasks();
    }
}

function readTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <div>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
                <button class="${task.completed ? 'undo' : 'complete'}" onclick="toggleComplete(${index})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function editTask(index) {
    Swal.fire({
        title: 'Edit Task',
        input: 'text',
        inputValue: tasks[index].text,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== '') {
            tasks[index].text = result.value.trim();
            saveTasks();
            readTasks();
        }
    });
}

function deleteTask(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            tasks.splice(index, 1);
            saveTasks();
            readTasks();
            Swal.fire(
                'Deleted!',
                'Your task has been deleted.',
                'success'
            )
        }
    });
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    readTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}