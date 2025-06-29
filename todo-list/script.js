// 毒鸡汤语录库
const quotes = [
    "不努力一下，怎么知道什么叫绝望",
    "努力不一定成功，但不努力一定很轻松",
    "今天的不开心就到此为止吧，明天依然不开心",
    "假如生活欺骗了你，不要悲伤，它明天还会继续欺骗你",
    "万事开头难，然后中间难，最后结尾难",
    "你并不是一无所有，你还有病啊",
    "咸鱼翻身，还是咸鱼"
];

// DOM元素
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const quoteDisplay = document.getElementById('quote-display');
const taskCountDisplay = document.getElementById('task-count');
const efficiencyDisplay = document.getElementById('efficiency');
const moodEmoji = document.getElementById('mood-emoji');
const soundEffect = document.getElementById('sound-effect');
const body = document.body;

// 初始化
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();
updateStats();
showRandomQuote();

// 事件监听
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// 添加任务
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        // 播放音效
        soundEffect.play();
        
        // 添加动画
        addBtn.classList.add('animate__rubberBand');
        setTimeout(() => {
            addBtn.classList.remove('animate__rubberBand');
        }, 1000);
        
        // 创建任务
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        updateStats();
        taskInput.value = '';
    }
}

// 渲染任务列表
function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete-btn">${task.completed ? '撤销' : '完成'}</button>
                <button class="delete-btn">不想干了</button>
            </div>
        `;
        
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(li);
    });
    
    // 根据任务数量切换主题
    updateTheme();
}

// 切换任务完成状态
function toggleComplete(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

// 删除任务
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
    showRandomQuote();
}

// 保存到本地存储
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 更新统计信息
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    taskCountDisplay.textContent = total - completed;
    
    const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;
    efficiencyDisplay.textContent = `${efficiency}%`;
    
    // 根据效率改变样式
    efficiencyDisplay.style.color = efficiency > 50 ? '#00b894' : '#d63031';
}

// 显示随机语录
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = `"${quotes[randomIndex]}"`;
}

// 更新主题
function updateTheme() {
    const uncompletedCount = tasks.filter(task => !task.completed).length;
    
    if (uncompletedCount >= 5) {
        body.classList.remove('happy-theme');
        body.classList.add('sad-theme');
        moodEmoji.textContent = '😫';
    } else {
        body.classList.remove('sad-theme');
        body.classList.add('happy-theme');
        moodEmoji.textContent = '😊';
    }
}

// 每隔30秒更换一次语录
setInterval(showRandomQuote, 30000);