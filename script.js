// 用户设置
let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {
    primaryColor: '#FF9A76',
    bgColor: '#FFF5EB',
    quoteStyle: 'cute',
    nickname: '小美',
    bgImage: null
};

// 不同风格的语录库
const quoteStyles = {
    cute: [
        "每天进步一点点，生活变得更美好 🌸",
        "你已经很棒了，休息一下也没关系 ☕",
        "小小的任务，大大的成就 ✨",
        "慢慢来，比较快 🐢",
        "完成一件事就奖励自己一下吧 🍪"
    ],
    simple: [
        "积少成多，聚沙成塔",
        "持之以恒，方能成功",
        "今日事，今日毕",
        "一步一个脚印",
        "量变引起质变"
       
    ],
    food: [
        "生活就像巧克力，有苦也有甜 🍫",
        "完成任务就像吃蛋糕，一口一口来 🍰",
        "今天的你像甜甜圈一样完美 🍩",
        "保持能量，像咖啡一样提神 ☕",
        "慢慢来，像煮汤一样需要时间 🍲"
         "生活就像气泡水，偶尔冒的小泡，就是平凡里的甜🍰"
    ],
    nature: [
        "阳光总在风雨后 🌈",
        "像大树一样稳步成长 🌳",
        "保持如溪流般的持续前进 💧",
        "如春风般温柔的对待自己 🌬️",
        "像星星一样闪耀自己的光芒 ✨"
    ]
};

// 网易云音乐推荐歌单 (纯音乐)
const musicList = [
    { name: "清晨的阳光", url: "https://music.163.com/song/media/outer/url?id=1330348068.mp3" },
    { name: "雨中的冥想", url: "https://music.163.com/song/media/outer/url?id=1330348069.mp3" },
    { name: "星空下的钢琴曲", url: "https://music.163.com/song/media/outer/url?id=1330348070.mp3" },
    { name: "午后的小憩", url: "https://music.163.com/song/media/outer/url?id=1330348071.mp3" },
    { name: "夜晚的宁静", url: "https://music.163.com/song/media/outer/url?id=1330348072.mp3" },
    { name: "森林漫步", url: "https://music.163.com/song/media/outer/url?id=1330348073.mp3" },
    { name: "海边微风", url: "https://music.163.com/song/media/outer/url?id=1330348074.mp3" },
    { name: "山谷回声", url: "https://music.163.com/song/media/outer/url?id=1330348075.mp3" }
];

// 完成任务的表情
const completionEmojis = ["👍", "🎯", "✅", "👏", "💯", "✨", "🌟", "🥳"];

// DOM元素
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statusMessage = document.getElementById('statusMessage');
const quoteText = document.getElementById('quoteText');
const refreshQuote = document.getElementById('refreshQuote');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const quoteStyleSelect = document.getElementById('quoteStyle');
const colorOptions = document.querySelectorAll('.color-option');
const bgImageInput = document.getElementById('bgImageInput');
const resetBtn = document.getElementById('resetBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const nicknameInput = document.getElementById('nicknameInput');
const appTitle = document.getElementById('appTitle');
const timeDisplay = document.getElementById('timeDisplay');
const musicPlayer = document.getElementById('musicPlayer');
const bgMusic = document.getElementById('bgMusic');

// 初始化任务数组
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    renderTasks();
    updateStatusMessage();
    showRandomQuote();
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化音乐播放器
    setupMusicPlayer();
});

// 设置音乐播放器
function setupMusicPlayer() {
    // 点击播放/暂停
    musicPlayer.addEventListener('click', function() {
        if (bgMusic.paused) {
            playRandomMusic();
        } else {
            bgMusic.pause();
            musicPlayer.classList.remove('playing');
        }
    });
    
    // 音乐结束自动播放下一首
    bgMusic.addEventListener('ended', playRandomMusic);
}

// 播放随机音乐
function playRandomMusic() {
    const randomMusic = musicList[Math.floor(Math.random() * musicList.length)];
    bgMusic.src = randomMusic.url;
    bgMusic.play()
        .then(() => {
            musicPlayer.classList.add('playing');
            // 更新标签显示当前播放歌曲
            const label = musicPlayer.querySelector('.music-label');
            label.textContent = `正在播放: ${randomMusic.name}`;
            
            // 3秒后恢复默认标签
            setTimeout(() => {
                if (!bgMusic.paused) {
                    label.textContent = '今日推荐歌曲';
                }
            }, 3000);
        })
        .catch(error => {
            console.error('播放音乐失败:', error);
            // 如果播放失败，尝试下一首
            setTimeout(playRandomMusic, 1000);
        });
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    timeDisplay.textContent = now.toLocaleDateString('zh-CN', options);
}

// 添加任务
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// 刷新语录
refreshQuote.addEventListener('click', showRandomQuote);

// 设置按钮点击
settingsBtn.addEventListener('click', toggleSettingsMenu);

// 颜色选择
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // 移除同组的所有选中状态
        const group = option.getAttribute('data-color');
        document.querySelectorAll(`.color-option[data-color="${group}"]`).forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // 添加选中状态
        option.classList.add('selected');
    });
});

// 背景图片选择
bgImageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            userSettings.bgImage = event.target.result;
            applyBgImage();
        };
        reader.readAsDataURL(file);
    }
});

// 恢复默认设置
resetBtn.addEventListener('click', function() {
    userSettings.bgImage = null;
    userSettings.bgColor = '#FFF5EB';
    userSettings.primaryColor = '#FF9A76';
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = userSettings.bgColor;
    
    // 更新颜色选择器
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
        if (option.style.backgroundColor === userSettings.primaryColor && option.getAttribute('data-color') === 'primary') {
            option.classList.add('selected');
        }
    });
    
    applySettings();
});

// 保存设置
saveSettingsBtn.addEventListener('click', function() {
    userSettings.nickname = nicknameInput.value || '小美';
    userSettings.quoteStyle = quoteStyleSelect.value;
    
    // 获取选中的颜色
    const primarySelected = document.querySelector('.color-option.selected[data-color="primary"]');
    
    if (primarySelected) {
        userSettings.primaryColor = primarySelected.style.backgroundColor;
    }
    
    saveSettings();
    applySettings();
    toggleSettingsMenu();
});

// 加载设置
function loadSettings() {
    // 更新UI
    nicknameInput.value = userSettings.nickname;
    quoteStyleSelect.value = userSettings.quoteStyle;
    
    // 设置颜色选项
    document.querySelectorAll('.color-option').forEach(option => {
        const group = option.getAttribute('data-color');
        if (group === 'primary' && option.style.backgroundColor === userSettings.primaryColor) {
            option.classList.add('selected');
        }
    });
    
    // 应用设置
    applySettings();
    updateAppTitle();
}

// 应用设置
function applySettings() {
    // 应用颜色
    document.documentElement.style.setProperty('--primary', userSettings.primaryColor);
    document.documentElement.style.setProperty('--bg', userSettings.bgColor);
    
    // 计算衍生颜色
    const primaryLight = lightenColor(userSettings.primaryColor, 20);
    const secondary = lightenColor(userSettings.primaryColor, 40);
    const accent = darkenColor(userSettings.primaryColor, 10);
    
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--secondary', secondary);
    document.documentElement.style.setProperty('--accent', accent);
    
    // 应用背景图片
    applyBgImage();
    
    // 更新应用标题
    updateAppTitle();
}

// 应用背景图片
function applyBgImage() {
    if (userSettings.bgImage) {
        document.body.style.backgroundImage = `url(${userSettings.bgImage})`;
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = userSettings.bgColor;
    }
}

// 更新应用标题
function updateAppTitle() {
    appTitle.innerHTML = `<span class="sun-emoji">☀️</span>${userSettings.nickname}的待办清单`;
}

// 保存设置
function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

// 切换设置菜单
function toggleSettingsMenu() {
    settingsMenu.classList.toggle('show');
}

// 添加任务函数
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStatusMessage();
    
    taskInput.value = '';
    taskInput.focus();
}

// 渲染任务列表
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <span class="emoji">📝</span>
                <p>暂时没有待办事项</p>
            </div>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">×</button>
        `;
        
        taskList.appendChild(taskItem);
        
        // 添加事件监听
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    });
}

// 切换任务完成状态
function toggleTaskComplete(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
    updateStatusMessage();
}

// 删除任务
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateStatusMessage();
}

// 保存任务到本地存储
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 更新状态消息
function updateStatusMessage() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    if (totalTasks === 0) {
        statusMessage.innerHTML = '<span class="emoji">🌞</span> 今天是个美好的开始！';
        statusMessage.classList.remove('success');
        return;
    }
    
    if (completedTasks === totalTasks) {
        const randomEmoji = completionEmojis[Math.floor(Math.random() * completionEmojis.length)];
        statusMessage.innerHTML = `<span class="emoji">${randomEmoji}</span> 全部完成！太棒了！`;
        statusMessage.classList.add('success');
        return;
    }
    
    const statusMessages = [
        `已完成 ${completedTasks}/${totalTasks} 项任务 💪`,
        `还有 ${totalTasks - completedTasks} 件事等着你 🌱`,
        `慢慢来，已经完成 ${completedTasks} 件了 🌟`,
        `今天也要加油哦 ☕`,
        `每完成一件事都是进步 ✨`
    ];
    
    const randomMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    statusMessage.innerHTML = `<span class="emoji">📋</span> ${randomMessage}`;
    statusMessage.classList.remove('success');
}

// 显示随机语录
function showRandomQuote() {
    const quotes = quoteStyles[userSettings.quoteStyle] || quoteStyles.cute;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
}

// 颜色处理函数
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
    return "#" + (
        0x1000000 +
        (R > 0 ? (R < 255 ? R : 255) : 0) * 0x10000 +
        (G > 0 ? (G < 255 ? G : 255) : 0) * 0x100 +
        (B > 0 ? (B < 255 ? B : 255) : 0)
    ).toString(16).slice(1);
}
