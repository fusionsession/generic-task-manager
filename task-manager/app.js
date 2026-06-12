let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const aboutLink = document.getElementById('about-link');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    let completedCount = tasks.filter(t => t.completed).length;

    tasks.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-date">Created: ${task.created_date} ${task.created_time}</span>
            </div>
            <div class="controls">
                <button class="up-btn" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="down-btn" ${index === tasks.length-1 ? 'disabled' : ''}>↓</button>
                <button class="edit-btn">🖋️</button>
                <button class="delete-btn">🗑</button>
            </div>
        `;

        // Checkbox
        item.querySelector('input[type="checkbox"]').addEventListener('change', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Edit
        item.querySelector('.edit-btn').addEventListener('click', () => {
            const newText = prompt('Edit task (you can use <b>bold</b>, <i>italic</i>, <u>underline</u>):', task.text);
            if (newText !== null) {
                tasks[index].text = newText;
                saveTasks();
                renderTasks();
            }
        });

        // Move Up
        item.querySelector('.up-btn').addEventListener('click', () => {
            if (index > 0) {
                [tasks[index], tasks[index-1]] = [tasks[index-1], tasks[index]];
                saveTasks();
                renderTasks();
            }
        });

        // Move Down
        item.querySelector('.down-btn').addEventListener('click', () => {
            if (index < tasks.length - 1) {
                [tasks[index], tasks[index+1]] = [tasks[index+1], tasks[index]];
                saveTasks();
                renderTasks();
            }
        });

        // Delete
        item.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Delete this task?')) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }
        });

        taskList.appendChild(item);
    });

    document.getElementById('stats').textContent = `${completedCount} of ${tasks.length} tasks implemented`;
}

// Add task
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        const now = new Date();
        tasks.push({
            id: Date.now(),
            text: text,
            created_date: now.toISOString().split('T')[0],
            created_time: now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'),
            completed: false
        });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
});

taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addBtn.click();
});

// ==================== ABOUT MODAL ====================
const aboutContent = `
Technical Implementation
• Single Page Application (SPA) built with vanilla HTML, CSS and JavaScript
• Persistent storage using browser LocalStorage
• Full CRUD operations (Create, Read, Update, Delete)
• Task reordering with smart Up/Down buttons
• Completion status with strike-through on text only
• Real-time statistics: "X of Y tasks implemented"
• Roboto font for clean typography
• Gentle-pink color scheme:
   - Primary: #f039b1
   - Secondary: #f29ad8, #f658b8

Usage Instructions
1. Type a task in the input field and click "Add Task" or press Enter
2. Check the box to mark task as completed (only text is struck through)
3. Click 🖋️ to edit task (supports <b>bold</b>, <i>italic</i>, <u>underline</u>)
4. Use ↑ ↓ arrows to reorder tasks (disabled on edges)
5. Click 🗑 to delete a task
6. All changes are automatically saved in your browser

Project created as a clean student task management prototype.
`;

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();

    let modal = document.getElementById('about-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'about-modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <h2>Generic Task Manager</h2>
        <div style="white-space: pre-wrap; line-height: 1.7;">${aboutContent}</div>
        <button onclick="this.closest('#about-modal').remove()">Close</button>
    `;
    modal.style.display = 'block';
});

// Initial render
renderTasks();