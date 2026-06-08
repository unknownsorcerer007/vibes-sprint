// Initialize Lucide Icons
lucide.createIcons();

// STATE & CONFIG
let currentTheme = 'lofi';
let timerInterval = null;
let isTimerRunning = false;
let currentTimerMode = 'focus'; // 'focus', 'short', 'long'
let timerDuration = 25 * 60; // default 25 min in seconds
let timeLeft = timerDuration;
let completedSprints = 0;

// Quotes Collection
const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus is a muscle, and you build it through distraction-free repetitions.", author: "Deep Work" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Quality means doing it right when no one is looking.", author: "Henry Ford" },
    { text: "Make it simple, but significant.", author: "Don Draper" },
    { text: "Your mind is for having ideas, not holding them.", author: "David Allen" }
];

// Kanban Board State
let tasks = JSON.parse(localStorage.getItem('vibes_sprint_tasks')) || [
    { id: '1', title: 'Plan Sprint Tasks', desc: 'Create initial tasks and assign priorities for the Vibes Sprint dashboard.', status: 'todo', priority: 'high', tag: 'Planning' },
    { id: '2', title: 'Design Glassmorphism Theme', desc: 'Style the dashboard with smooth gradients, shadows, and frosted glass borders.', status: 'progress', priority: 'medium', tag: 'Design' },
    { id: '3', title: 'Integrate Web Audio API Synth', desc: 'Create procedural ambient rainfall and lofi beats synthesizer.', status: 'review', priority: 'high', tag: 'Audio' },
    { id: '4', title: 'Set up Git repo', desc: 'Initialize local repository and verify github CLI auth.', status: 'done', priority: 'low', tag: 'Git' }
];

// AUDIO CONTEXT & SYNTHESIZERS
let audioCtx = null;
let lofiInterval = null;
let masterGain = null;
let isAudioInitialized = false;

// Synthesizer Nodes
let rainNode = null;
let rainFilter = null;
let rainGain = null;

let staticNode = null;
let staticFilter = null;
let staticGain = null;

let lofiGain = null;

// DOM ELEMENTS
const dateDisplay = document.getElementById('date-display');
const themeButtons = document.querySelectorAll('.vibe-btn');
const timerTime = document.getElementById('timer-time');
const timerPlayPause = document.getElementById('timer-play-pause');
const timerReset = document.getElementById('timer-reset');
const playIcon = document.getElementById('play-icon');
const playText = document.getElementById('play-text');
const timerModeButtons = document.querySelectorAll('.timer-mode-btn');
const progressCircle = document.getElementById('timer-progress');
const statSprints = document.getElementById('stat-sprints');
const statTasks = document.getElementById('stat-tasks');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

// Sound Board Controls
const toggleAmbientBtn = document.getElementById('toggle-ambient');
const ambientIcon = document.getElementById('ambient-icon');
const volMusic = document.getElementById('vol-music');
const volRain = document.getElementById('vol-rain');
const volNoise = document.getElementById('vol-noise');

// Kanban Columns
const cardsTodo = document.getElementById('cards-todo');
const cardsProgress = document.getElementById('cards-progress');
const cardsReview = document.getElementById('cards-review');
const cardsDone = document.getElementById('cards-done');
const countTodo = document.getElementById('count-todo');
const countProgress = document.getElementById('count-progress');
const countReview = document.getElementById('count-review');
const countDone = document.getElementById('count-done');

// Modal Elements
const btnNewTask = document.getElementById('btn-new-task');
const taskModal = document.getElementById('task-modal');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const taskForm = document.getElementById('task-form');

// --- DATE DISPLAY ---
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}
updateDate();

// --- THEME SELECTOR ---
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-vibe');
        document.body.className = `theme-${theme}`;
        
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentTheme = theme;
        updateAccentColor();
        triggerVibeChangePulse(btn);
    });
});

function updateAccentColor() {
    const root = document.documentElement;
    let accent = '#f7a8b8';
    if (currentTheme === 'cyberpunk') accent = '#ff007f';
    else if (currentTheme === 'sunset') accent = '#ff5e62';
    else if (currentTheme === 'forest') accent = '#a8ff78';
    else if (currentTheme === 'synthwave') accent = '#d946ef';
    
    root.style.setProperty('--accent-color', accent);
}

function triggerVibeChangePulse(button) {
    const activeColor = button.style.getPropertyValue('--vibe-color');
    const borderGlow = document.querySelector('.app-header');
    borderGlow.style.boxShadow = `0 8px 32px 0 rgba(0, 0, 0, 0.2), 0 0 15px ${activeColor}40`;
    setTimeout(() => {
        borderGlow.style.boxShadow = '';
    }, 1000);
}

// --- WEB AUDIO API SYNTHESIZER ---

function initAudio() {
    if (isAudioInitialized) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Master Gain
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
    
    // 1. Rain Synthesizer (White noise modulated + Bandpass filter)
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    rainNode = audioCtx.createBufferSource();
    rainNode.buffer = noiseBuffer;
    rainNode.loop = true;
    
    rainFilter = audioCtx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
    rainFilter.Q.setValueAtTime(0.8, audioCtx.currentTime);
    
    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    
    rainNode.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(masterGain);
    rainNode.start();
    
    // 2. Static Noise Synthesizer (Low-pass filtered white noise)
    staticNode = audioCtx.createBufferSource();
    staticNode.buffer = noiseBuffer;
    staticNode.loop = true;
    
    staticFilter = audioCtx.createBiquadFilter();
    staticFilter.type = 'lowpass';
    staticFilter.frequency.setValueAtTime(120, audioCtx.currentTime);
    
    staticGain = audioCtx.createGain();
    staticGain.gain.setValueAtTime(0, audioCtx.currentTime);
    
    staticNode.connect(staticFilter);
    staticFilter.connect(staticGain);
    staticGain.connect(masterGain);
    staticNode.start();
    
    // 3. Lofi Beats Synthesizer (Triggered chord loops)
    lofiGain = audioCtx.createGain();
    lofiGain.gain.setValueAtTime(0, audioCtx.currentTime);
    lofiGain.connect(masterGain);
    
    startLofiChords();
    
    isAudioInitialized = true;
}

// Generate beautiful minor 7th & major 7th chord progressions procedurally
function playLofiNote(freq, time, duration, vol) {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    
    // Soft lofi low-pass filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, time);
    
    // Soft attack & long decay
    oscGain.gain.setValueAtTime(0, time);
    oscGain.gain.linearRampToValueAtTime(vol, time + 0.5);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(lofiGain);
    
    osc.start(time);
    osc.stop(time + duration);
}

function playChord(chord, time, duration) {
    chord.forEach(freq => {
        playLofiNote(freq, time, duration, 0.15);
    });
}

function startLofiChords() {
    // Curated smooth chill chord frequencies (Hz)
    // Progression: Cmaj7 -> Am7 -> Dm7 -> G9
    const progressions = [
        [130.81, 164.81, 196.00, 246.94], // Cmaj7
        [110.00, 130.81, 164.81, 196.00], // Am7
        [146.83, 174.61, 220.00, 261.63], // Dm7
        [98.00, 146.83, 174.61, 220.00]   // G7sus
    ];
    
    let index = 0;
    
    lofiInterval = setInterval(() => {
        if (!audioCtx || lofiGain.gain.value === 0) return;
        
        const now = audioCtx.currentTime;
        const chord = progressions[index];
        
        // Play chord
        playChord(chord, now, 3.8);
        
        // Add a gentle syncopated soft Rhodes synth beat / sub-bass pop
        playLofiNote(55, now + 1, 0.3, 0.12);
        playLofiNote(55, now + 2.5, 0.3, 0.12);
        
        index = (index + 1) % progressions.length;
    }, 4000);
}

// Adjust Synth Volumes
volMusic.addEventListener('input', (e) => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const val = e.target.value / 100;
    lofiGain.gain.setTargetAtTime(val * 0.4, audioCtx.currentTime, 0.1);
    updateAudioIconState();
});

volRain.addEventListener('input', (e) => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const val = e.target.value / 100;
    rainGain.gain.setTargetAtTime(val * 0.5, audioCtx.currentTime, 0.1);
    
    // Modulate filter freq slightly to sound like wind gusts
    if (rainFilter) {
        rainFilter.frequency.setTargetAtTime(300 + (val * 200), audioCtx.currentTime, 0.2);
    }
    updateAudioIconState();
});

volNoise.addEventListener('input', (e) => {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const val = e.target.value / 100;
    staticGain.gain.setTargetAtTime(val * 0.25, audioCtx.currentTime, 0.1);
    updateAudioIconState();
});

// Toggle Master Sound button
toggleAmbientBtn.addEventListener('click', () => {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    if (masterGain.gain.value > 0) {
        masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
        ambientIcon.setAttribute('data-lucide', 'volume-x');
    } else {
        masterGain.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0.1);
        ambientIcon.setAttribute('data-lucide', 'volume-2');
    }
    lucide.createIcons();
});

function updateAudioIconState() {
    const totalVolume = parseFloat(volMusic.value) + parseFloat(volRain.value) + parseFloat(volNoise.value);
    if (totalVolume > 0 && masterGain && masterGain.gain.value > 0) {
        ambientIcon.setAttribute('data-lucide', 'volume-2');
    } else {
        ambientIcon.setAttribute('data-lucide', 'volume-x');
    }
    lucide.createIcons();
}

// Play notification sound when Pomodoro/Break ends
function playAlarmNotification() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // Beautiful electronic chime
    playLofiNote(523.25, now, 0.2, 0.25); // C5
    playLofiNote(659.25, now + 0.15, 0.2, 0.25); // E5
    playLofiNote(783.99, now + 0.3, 0.4, 0.3); // G5
}

// --- POMODORO TIMER ---
const circleCircumference = 2 * Math.PI * 72;
progressCircle.style.strokeDasharray = circleCircumference;
progressCircle.style.strokeDashoffset = 0;

function setProgress(percent) {
    const offset = circleCircumference - (percent / 100) * circleCircumference;
    progressCircle.style.strokeDashoffset = offset;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress ring
    const totalDuration = getModeDuration(currentTimerMode);
    const percent = ((totalDuration - timeLeft) / totalDuration) * 100;
    setProgress(percent);
}

function getModeDuration(mode) {
    if (mode === 'focus') return 25 * 60;
    if (mode === 'short') return 5 * 60;
    if (mode === 'long') return 15 * 60;
    return 25 * 60;
}

function switchTimerMode(mode) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    currentTimerMode = mode;
    timeLeft = getModeDuration(mode);
    
    timerModeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        }
    });
    
    playIcon.setAttribute('data-lucide', 'play');
    playText.textContent = 'Start';
    lucide.createIcons();
    updateTimerDisplay();
}

timerModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTimerMode(btn.getAttribute('data-mode'));
    });
});

timerPlayPause.addEventListener('click', () => {
    initAudio(); // Initialize audio context on play click to comply with browser policy
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        playIcon.setAttribute('data-lucide', 'play');
        playText.textContent = 'Start';
    } else {
        isTimerRunning = true;
        playIcon.setAttribute('data-lucide', 'pause');
        playText.textContent = 'Pause';
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                playAlarmNotification();
                handleTimerEnd();
            }
        }, 1000);
    }
    lucide.createIcons();
});

timerReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = getModeDuration(currentTimerMode);
    playIcon.setAttribute('data-lucide', 'play');
    playText.textContent = 'Start';
    lucide.createIcons();
    updateTimerDisplay();
});

function handleTimerEnd() {
    if (currentTimerMode === 'focus') {
        completedSprints++;
        statSprints.textContent = completedSprints;
        alert("Focus Sprint Completed! Time for a short break.");
        switchTimerMode('short');
        
        // Dynamic Quote update
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `— ${randomQuote.author}`;
    } else {
        alert("Break is over! Ready to focus?");
        switchTimerMode('focus');
    }
}

// Initial Timer display setup
updateTimerDisplay();

// --- KANBAN SPRINT BOARD ---

function saveTasks() {
    localStorage.setItem('vibes_sprint_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    // Clear all column containers
    cardsTodo.innerHTML = '';
    cardsProgress.innerHTML = '';
    cardsReview.innerHTML = '';
    cardsDone.innerHTML = '';
    
    let todoCount = 0;
    let progressCount = 0;
    let reviewCount = 0;
    let doneCount = 0;
    
    tasks.forEach(task => {
        const card = createTaskCardElement(task);
        
        if (task.status === 'todo') {
            cardsTodo.appendChild(card);
            todoCount++;
        } else if (task.status === 'progress') {
            cardsProgress.appendChild(card);
            progressCount++;
        } else if (task.status === 'review') {
            cardsReview.appendChild(card);
            reviewCount++;
        } else if (task.status === 'done') {
            cardsDone.appendChild(card);
            doneCount++;
        }
    });
    
    // Update count labels
    countTodo.textContent = todoCount;
    countProgress.textContent = progressCount;
    countReview.textContent = reviewCount;
    countDone.textContent = doneCount;
    
    // Update completed tasks stat
    statTasks.textContent = doneCount;
    
    // Initialize drag-and-drop event listeners
    initDragAndDrop();
}

function createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', task.id);
    
    card.innerHTML = `
        <div class="task-card-header">
            <h4>${escapeHTML(task.title)}</h4>
        </div>
        <p>${escapeHTML(task.desc || 'No description.')}</p>
        <div class="task-meta">
            <span class="priority-badge ${task.priority}">${task.priority}</span>
            <span class="task-tag">${escapeHTML(task.tag)}</span>
        </div>
        <div class="task-actions">
            <div class="move-buttons">
                <button class="btn-move btn-move-left" title="Move Left">
                    <i data-lucide="chevron-left"></i>
                </button>
                <button class="btn-move btn-move-right" title="Move Right">
                    <i data-lucide="chevron-right"></i>
                </button>
            </div>
            <button class="btn-delete" title="Delete Task">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `;
    
    // Drag events
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        card.style.opacity = '0.5';
    });
    
    card.addEventListener('dragend', () => {
        card.style.opacity = '1';
    });
    
    // Move buttons events (mobile/tablet friendly)
    const btnLeft = card.querySelector('.btn-move-left');
    const btnRight = card.querySelector('.btn-move-right');
    const btnDel = card.querySelector('.btn-delete');
    
    btnLeft.addEventListener('click', () => moveTask(task.id, 'left'));
    btnRight.addEventListener('click', () => moveTask(task.id, 'right'));
    btnDel.addEventListener('click', () => deleteTask(task.id));
    
    // Hide move-left if already in todo, or move-right if in done
    if (task.status === 'todo') btnLeft.style.visibility = 'hidden';
    if (task.status === 'done') btnRight.style.visibility = 'hidden';
    
    // Instantiate icons
    setTimeout(() => lucide.createIcons({attrs: {class: 'lucide-icon'}}, card), 0);
    
    return card;
}

function moveTask(id, direction) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const statusOrder = ['todo', 'progress', 'review', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    
    if (direction === 'left' && currentIndex > 0) {
        task.status = statusOrder[currentIndex - 1];
    } else if (direction === 'right' && currentIndex < statusOrder.length - 1) {
        task.status = statusOrder[currentIndex + 1];
    }
    
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// --- DRAG & DROP FOR KANBAN ---
function initDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-column');
    
    columns.forEach(col => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.style.background = 'rgba(255, 255, 255, 0.03)';
        });
        
        col.addEventListener('dragleave', () => {
            col.style.background = '';
        });
        
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.style.background = '';
            
            const taskId = e.dataTransfer.getData('text/plain');
            const targetStatus = col.getAttribute('data-status');
            
            const task = tasks.find(t => t.id === taskId);
            if (task && task.status !== targetStatus) {
                task.status = targetStatus;
                saveTasks();
                renderTasks();
            }
        });
    });
}

// --- NEW TASK MODAL ---
btnNewTask.addEventListener('click', () => {
    taskModal.classList.add('open');
});

function closeModal() {
    taskModal.classList.remove('open');
    taskForm.reset();
}

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    const tag = document.getElementById('task-tag').value || 'General';
    
    const newTask = {
        id: Date.now().toString(),
        title,
        desc,
        status: 'todo',
        priority,
        tag
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    closeModal();
});

// Helper to sanitize user input to avoid XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// INITIAL BOARD RENDER
renderTasks();
