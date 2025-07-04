
let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {
    primaryColor: '#FF9A76',
    bgColor: '#FFF5EB',
    quoteStyle: 'cute',
    nickname: '小美',
    bgImage: null
};

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
    ],
    nature: [
        "阳光总在风雨后 🌈",
        "像大树一样稳步成长 🌳",
        "保持如溪流般的持续前进 💧",
        "如春风般温柔的对待自己 🌬️",
        "像星星一样闪耀自己的光芒 ✨"
    ]
};

const musicList = [
    { name: "Rising of the Dream", url: "song/M1.mp3" },
    { name: "Merry Christmas, Mr Lawrence", url: "song/M2.mp3" },
    { name: "风笛", url: "song/M3.mp3" },
    { name: "午后的小憩", url: "https://music.163.com/song/media/outer/url?id=1330348071.mp3" },
    { name: "夜晚的宁静", url: "https://music.163.com/song/media/outer/url?id=1330348072.mp3" },
    { name: "森林漫步", url: "https://music.163.com/song/media/outer/url?id=1330348073.mp3" },
    { name: "山谷回声", url: "https://music.163.com/song/media/outer/url?id=1330348075.mp3" }
];

const completionEmojis = ["👍", "🎯", "✅", "👏", "💯", "✨", "🌟", "🥳"];

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

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    renderTasks();
    updateStatusMessage();
    showRandomQuote();
    updateTime();
    setInterval(updateTime, 1000);
    
    setupMusicPlayer();
});

function setupMusicPlayer() {

    musicPlayer.addEventListener('click', function() {
        if (bgMusic.paused) {
            playRandomMusic();
        } else {
            bgMusic.pause();
            musicPlayer.classList.remove('playing');
        }
    });

    bgMusic.addEventListener('ended', playRandomMusic);
}

function playRandomMusic() {
    const randomMusic = musicList[Math.floor(Math.random() * musicList.length)];
    bgMusic.src = randomMusic.url;
    bgMusic.play()
        .then(() => {
            musicPlayer.classList.add('playing');
            
            const label = musicPlayer.querySelector('.music-label');
            label.textContent = `正在播放: ${randomMusic.name}`;
         
            setTimeout(() => {
                if (!bgMusic.paused) {
                    label.textContent = '今日推荐歌曲';
                }
            }, 3000);
        })
        .catch(error => {
            console.error('播放音乐失败:', error);
         
            setTimeout(playRandomMusic, 1000);
        });
}

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

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

refreshQuote.addEventListener('click', showRandomQuote);

settingsBtn.addEventListener('click', toggleSettingsMenu);

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      
        const group = option.getAttribute('data-color');
        document.querySelectorAll(`.color-option[data-color="${group}"]`).forEach(opt => {
            opt.classList.remove('selected');
        });
      
        option.classList.add('selected');
    });
});

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

resetBtn.addEventListener('click', function() {
    userSettings.bgImage = null;
    userSettings.bgColor = '#FFF5EB';
    userSettings.primaryColor = '#FF9A76';
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = userSettings.bgColor;
 
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
        if (option.style.backgroundColor === userSettings.primaryColor && option.getAttribute('data-color') === 'primary') {
            option.classList.add('selected');
        }
    });
    
    applySettings();
});

saveSettingsBtn.addEventListener('click', function() {
    userSettings.nickname = nicknameInput.value || '小美';
    userSettings.quoteStyle = quoteStyleSelect.value;
   
    const primarySelected = document.querySelector('.color-option.selected[data-color="primary"]');
    
    if (primarySelected) {
        userSettings.primaryColor = primarySelected.style.backgroundColor;
    }
    
    saveSettings();
    applySettings();
    toggleSettingsMenu();
});

function loadSettings() {

    nicknameInput.value = userSettings.nickname;
    quoteStyleSelect.value = userSettings.quoteStyle;
    
    document.querySelectorAll('.color-option').forEach(option => {
        const group = option.getAttribute('data-color');
        if (group === 'primary' && option.style.backgroundColor === userSettings.primaryColor) {
            option.classList.add('selected');
        }
    });

    applySettings();
    updateAppTitle();
}

function applySettings() {

    document.documentElement.style.setProperty('--primary', userSettings.primaryColor);
    document.documentElement.style.setProperty('--bg', userSettings.bgColor);

    const primaryLight = lightenColor(userSettings.primaryColor, 20);
    const secondary = lightenColor(userSettings.primaryColor, 40);
    const accent = darkenColor(userSettings.primaryColor, 10);
    
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--secondary', secondary);
    document.documentElement.style.setProperty('--accent', accent);

    applyBgImage();
 
    updateAppTitle();
}

function applyBgImage() {
    if (userSettings.bgImage) {
        document.body.style.backgroundImage = `url(${userSettings.bgImage})`;
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = userSettings.bgColor;
    }
}

function updateAppTitle() {
    appTitle.innerHTML = `<span class="sun-emoji">☀️</span>${userSettings.nickname}的待办清单`;
}

function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

function toggleSettingsMenu() {
    settingsMenu.classList.toggle('show');
}

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
     
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    });
}

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

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateStatusMessage();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

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

function showRandomQuote() {
    const quotes = quoteStyles[userSettings.quoteStyle] || quoteStyles.cute;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[randomIndex];
}

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
