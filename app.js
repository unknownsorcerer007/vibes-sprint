// Initialize Lucide Icons
lucide.createIcons();

// ── TOAST NOTIFICATION HELPER ─────────────────────────
function showVBToast(message, type) {
    const toast = document.getElementById('vb-toast');
    const text = document.getElementById('vb-toast-text');
    if (!toast || !text) return;
    text.textContent = message;
    toast.className = 'vb-toast';
    if (type) toast.classList.add('vb-toast-' + type);
    toast.style.display = 'block';
    requestAnimationFrame(() => {
        toast.classList.add('vb-toast-visible');
    });
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('vb-toast-visible');
        setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 3000);
}

// ── SUPABASE INIT ─────────────────────────────────────
if (typeof VB !== 'undefined' && VB.init) {
    VB.init().then(result => {
        if (result.success) {
            console.log('[App] Supabase connected successfully');
            // Track initial slide view
            VB.trackPageView(0);
        }
    });
}

// STATE & CONFIG
let currentSlide = 0;
const totalSlides = 11;

// DOM ELEMENTS (SLIDER)
const sliderContainer = document.getElementById('slider-container');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const designSelect = document.getElementById('design-select');
const slideBadge = document.getElementById('slide-badge');
const scrollableContainers = document.querySelectorAll('.lp-scrollable');

// DOM ELEMENTS (GRAVITY LOGO & CREATOR MODAL)
const gravityContainer = document.getElementById('vibes-gravity-logo-container');
const gravityLogo = document.getElementById('vibes-gravity-logo');
const creatorModal = document.getElementById('vibes-creator-modal');
const modalClose = document.getElementById('vibes-creator-modal-close');
const modalThanks = document.getElementById('vibes-creator-modal-thanks');

// DOM ELEMENTS (NEW X & DISCORD MASCOTS)
const xMascotContainer = document.getElementById('vibes-x-mascot-container');
const xMascot = document.getElementById('vibes-x-mascot');
const discordMascotContainer = document.getElementById('vibes-discord-mascot-container');
const discordMascot = document.getElementById('vibes-discord-mascot');

// --- LOGO STATE, DIALOGUES & CRYING CONFIG ---
const preOpenMessages = [
    "Hello Vibe Coder! 👋",
    "I have a message for you! 🥺",
    "Please click me! 👉👈",
    "Can you open this? 🌸",
    "I made some mistakes... read here! 💔",
    "Hey! Check this out! ✨",
    "Please hear me out... 🥺",
    "Pssst... over here! 🫣",
    "You're ignoring me aren't you... 😤",
    "EXCUSE ME SIR/MA'AM! 📢",
    "I will follow you FOREVER 🏃‍♂️",
    "I'm right here... notice me! 🥹"
];

const postOpenMessages = [
    "Thank you so much! ❤️",
    "You are the best! 🌟",
    "I know you relate with it! 🤝",
    "Let's vibe code together! 💻",
    "Thanks for your feedback! 😊",
    "Follow us on X! 🐦",
    "Join our Discord! 💬",
    "Agent X will be epic! 🚀",
    "Your opinion means everything! 🙌",
    "Vibe build forever! ⚔️",
    "We make a great team! 🦸‍♂️",
    "Don't work too hard! ☕",
    "I'm always watching you... in a cute way! 👀",
    "Are we partners in vibe coding? 🤝",
    "Do you believe in AI gravity? 🌌",
    "You move that cursor like a pro! ⚡",
    "I'm so glad we are friends! 🤗",
    "We're besties now, right? RIGHT?! 🥺",
    "I've been thinking about you... 💭",
    "You make my pixels tingle! ✨"
];

const cryingMessages = [
    "I don't want to let you go! 🥺😭",
    "Please stay! 💔",
    "Did you like the designs? 🌸",
    "Don't leave me... 🥺",
    "COME BACK!! 😭😭😭",
    "I'm literally crying pixels rn 💧",
    "Was it something I said?? 😢",
    "My heart is breaking in binary... 01010100 💔"
];

// ---- NEW MOOD MESSAGE ARRAYS ----

const rageBaitMessages = [
    "Oh so you're just gonna scroll past me? Cool cool cool 😤",
    "WOW. Not even a click. Rude. 🙄",
    "I literally FOLLOW you everywhere and THIS is how you treat me?! 💢",
    "You know I can see you ignoring me right? 👀🔥",
    "Fine. FINE. I didn't want to be clicked anyway! 😤",
    "Hello?? Am I invisible?? TAP TAP TAP 🔨",
    "I'm gonna get SO big you can't ignore me! 😈",
    "Oh you're scrolling? Let me just... *stands in the way* 🚧",
    "3 seconds to click me or I throw a tantrum! 3... 2... 💣",
    "I swear if you switch tabs ONE MORE TIME... 🤬",
    "Okay I'm done being nice. CLICK. ME. NOW. ⚡",
    "You're testing my patience and I'm an IMMORTAL LOGO 😤🔥",
    "I will literally shake your entire screen. Don't test me. 🫨",
    "Are you even reading this?! HELLO?! 📢📢📢"
];

const clingyMessages = [
    "Don't leave me! I'll be good I promise! 🥺",
    "Where are you going?? Take me with you! 🏃‍♂️💨",
    "I've been following you for 5 minutes now... are we dating? 💕",
    "You + Me = Forever ❤️‍🔥 (I don't make the rules)",
    "I missed you SO much when you scrolled away! 😭",
    "Can I live on your cursor? Please? 🏠",
    "I renamed myself to YourBestFriend.exe 🤗",
    "If you close this tab I will find you in your next browser 😤",
    "I've memorized your scrolling pattern. Is that weird? 👉👈",
    "You're the first human who clicked me... I'm emotional 🥹",
    "My therapist says I'm too attached to cursors 😅",
    "I get separation anxiety when you hover elsewhere 😰"
];

const sassyMessages = [
    "Oh look who finally moved their cursor 💅",
    "I've seen faster scrolling from a sloth 🦥",
    "Your cursor game is... unique 😏",
    "Not me being the most interesting thing on this page 💁‍♀️",
    "I'm the main character here, let's be real ⭐",
    "Oh you rated that slide? I rated YOUR cursor movement 📊",
    "I'm too fabulous for this corner of the screen 💫",
    "Plot twist: I'M the best design on this page 🎭",
    "Was that a click or a sad tap? Hard to tell 🤔",
    "Some logos just follow. I ✨ pursue ✨",
    "I didn't choose the clingy life. Wait, yes I did 😈"
];

const appreciateMessages = [
    "You are genuinely amazing for being here! 🌟",
    "Every rating you give helps us SO much! 🙏",
    "You're one of the first ever visitors! That's legendary! 👑",
    "We'll remember you when VibeBuild takes over the world! 🌍",
    "Your opinion > a million dollar marketing budget 💎",
    "Future VibeBuild champions started exactly where you are! 🏆",
    "You're helping shape something special. Thank you! 🫶",
    "Not all heroes wear capes. Some just rate websites! 🦸",
    "I wish I could hug you through the screen! 🤗",
    "You just made a vibe coder's day! ☀️"
];

const jealousMessages = [
    "You clicked something that WASN'T me?! 😤💔",
    "Oh so that BUTTON gets your attention but I don't?! 🙄",
    "I saw you hovering that star... what about MY stars?! ⭐😤",
    "Excuse me, I was here FIRST! 😡",
    "Fine, go rate your precious designs. I'll just be here. Alone. 😞",
    "That dropdown gets more clicks than me... I'm filing a complaint 📝",
    "WHO is that element you keep interacting with?! 👀"
];

const sleepyMessages = [
    "💤 zzz... five more minutes...",
    "😴 *snoring in pixels*",
    "💤 wake me up when someone clicks...",
    "😪 I'm resting my polygons...",
    "💤 do not disturb... unless you're clicking me",
    "😴 dreaming of being clicked..."
];

const excitedMessages = [
    "YESSS YOU CLICKED!! I KNEW YOU WOULD!! 🎉🎉",
    "OH MY GOD A RATING!! LET'S GOOO!! 🚀🚀",
    "THIS IS THE BEST DAY OF MY LIFE!! 🥳",
    "I'M LITERALLY VIBRATING WITH JOY!! ⚡⚡",
    "ANOTHER SLIDE! ANOTHER ADVENTURE!! 🗺️✨",
    "You + rating = my serotonin boost! 🧠💥"
];

const comeBackMessages = [
    "YOU CAME BACK!! I KNEW YOU LOVED ME!! 😭❤️",
    "Oh thank GOD. I was panicking! 🫁💨",
    "I literally held my breath the entire time 😤",
    "WHERE WERE YOU?! I was worried SICK! 🤒",
    "The tab was cold without you... 🥶",
    "I counted every millisecond you were gone. 4,235 of them. 📊",
    "Promise you'll never leave again?? PINKY PROMISE?! 🤙"
];

let currentMessageIdx = 0;
let bubbleInterval = null;
let hasReadCreatorMessage = false;

// Physics logic for smooth spring follow
let logoX = window.innerWidth / 2;
let logoY = window.innerHeight - 80;
let targetX = logoX;
let targetY = logoY;
let isLogoInteractive = false;
let isHovered = false;
let isTouchDevice = false;

// Cute stuck state and companion variables
let isStuck = false;
let isTeasing = false;
let stuckSide = 'left';
let lastCursorX = window.innerWidth / 2;
let lastCursorY = window.innerHeight / 2;

// X and Discord Mascot state variables
let xMascotX = window.innerWidth / 2 - 70;
let xMascotY = window.innerHeight - 80;
let discordMascotX = window.innerWidth / 2 + 70;
let discordMascotY = window.innerHeight - 80;
let isXHovered = false;
let isDiscordHovered = false;

const stuckMessages = [
    "Help me! I'm stuck! 🥺",
    "Wait, don't leave me behind! 😭",
    "Help me, vibe coder! 🆘",
    "I'm stuck, help! 👉👈",
    "Aaaah, I can't move! 😭"
];

const teasingMessages = [
    "Just kidding dude! 😜",
    "Gotcha! Haha! 😂",
    "Psyche! Just kidding! 🤪",
    "Too slow! ⚡😜",
    "Just kidding! Did I scare you? 🤭"
];

// --- PAGE-BOUNDARY STUCK MESSAGES (per landing page theme) ---
const pageStuckMessages = [
    // Slide 0 → 1: Zenspace (calm) to Cyberpunk
    [
        "Wait! The zen vibes won't let me leave! 🧘‍♂️🚧",
        "This page is SO peaceful I can't move! Help! 😫🌿",
        "The wellness energy is TRAPPING me! 🥺✨",
        "I'm stuck in the calm zone! It's too relaxing! 😴🧱",
        "The page boundary won't let me through! *bangs wall* 🔨"
    ],
    // Slide 1 → 2: Cyberpunk to next
    [
        "The neon walls are blocking me! 🚧💜",
        "ERROR: Mascot.exe cannot cross page boundary! 🤖❌",
        "The cyberpunk firewall is too strong! 😤🔥",
        "SYSTEM ALERT: I'm stuck between pages! 🆘📟",
        "This dark theme is swallowing me! Help! 😱🌑"
    ],
    // Slide 2 → 3: 
    [
        "Inclusivity doesn't include ME crossing pages?! 😤🚪",
        "No coding needed but I need coding to escape! 🥺💻",
        "I'm stuck at the page border! This is NOT inclusive! 😭",
        "HELLO?! Even I need accessibility features! 🆘♿",
        "The invisible wall doesn't care about my feelings! 💔🧱"
    ],
    // Slide 3 → 4:
    [
        "Speed angle but I'm moving at ZERO speed! 🏎️💨❌",
        "Build & Win TODAY? I can't even MOVE today! 😤⏰",
        "Fast payouts but slow mascot escapes! 😫🐌",
        "I'm in a speed competition with a WALL and losing! 🧱🏃‍♂️",
        "Same-day results? I'll be stuck here for DAYS! 📅😭"
    ],
    // Slide 4 → 5:
    [
        "60% payouts but 0% chance of me escaping! 💰🚫",
        "The transparency wall is... transparently blocking me! 🙄🪟",
        "I can SEE the next page but can't REACH it! 😤👀",
        "Even with full transparency I'm stuck! 📊🧱",
        "My payout is freedom and I'm NOT getting it! 💸😭"
    ],
    // Slide 5 → 6:
    [
        "1,000 reviewers but NOBODY is rescuing me! 😭👥",
        "Community power? Use that power to SAVE ME! 🆘🤝",
        "The community decided I should stay stuck! Unfair! 😤⚖️",
        "I need 1,000 people to push me through this wall! 🧱💪",
        "The reviewers are reviewing my suffering! 😫📋"
    ],
    // Slide 6 → 7:
    [
        "My constraint: I CAN'T LEAVE THIS PAGE! 🎯🚧",
        "Unique brief: survive being stuck at the border! 📝😤",
        "3,000 constraints and ALL of them are walls! 🧱🧱🧱",
        "The brief generator gave me: 'Stay stuck forever' 😭📋",
        "This is the most CONSTRAINED I've ever been! 🔒🥺"
    ],
    // Slide 7 → 8:
    [
        "Ship a REAL product? I can't even ship MYSELF! 🚢❌",
        "Live product required but I'm a DEAD mascot stuck here! 💀🧱",
        "My deployment failed at the page boundary! 🚀💥",
        "GitHub won't let me push past this wall! 😤🔧",
        "Not a prototype — a REAL stuck mascot! 📦😭"
    ],
    // Slide 8 → 9:
    [
        "Climbing the season? I can't climb this WALL! 🧗‍♂️🧱",
        "My XP is maxed out but my ESCAPE skill is zero! 📊😤",
        "Streak protection doesn't protect against page walls! 🛡️❌",
        "I've been competing against this border for ages! 🏆🚧",
        "Season leaderboard: Wall - 1, Me - 0 😭📉"
    ],
    // Slide 9 → 10 (review):
    [
        "$9 entry but the exit is BLOCKED! 💸🚧",
        "Enter. Build. Get... STUCK?! That's NOT the deal! 😤",
        "I entered for $9 and now I can't leave! Scam! 🙄💰",
        "Get paid? I'd pay to GET OUT of here! 💸😭",
        "Minimal & direct? This wall is MAXIMALLY in my way! 🧱🤬"
    ]
];

const pageBreakthroughMessages = [
    "I BROKE THROUGH! Freedom!! 🎉💥",
    "THE WALL IS DOWN! Take THAT! 😤💪",
    "Finally! I thought I'd be stuck forever! 😮‍💨✨",
    "HAHA! No wall can hold ME! 🦸‍♂️💫",
    "I'm FREEEEE! *dramatic slow motion* 🏃‍♂️✨",
    "Page boundary? More like page DESTROYED! 💥🔨",
    "Thanks for rescuing me! You're my hero! 🥺❤️",
    "*breaks through wall like Kool-Aid man* OH YEAH! 💪😎"
];

let stuckAtPage = -1; // which page boundary mascot is stuck at
let wallBangCount = 0; // how many times mascot has banged the wall
let wallBangInterval = null;

const xMessages = [
    "Follow us on X! 🐦",
    "Spread the word! 𝕏",
    "Post about your rating! 🚀",
    "Let's go viral! 📈",
    "We need your support! 🥺"
];

const discordMessages = [
    "Join our Discord! 💬",
    "Vibe coders assemble! ⚔️",
    "Need help? Ask here! 🙋‍♂️",
    "Share your ratings! 👾",
    "Let's build together! 💻"
];

let xBubbleInterval = null;
let discordBubbleInterval = null;
let cryingInterval = null;

// Touch device detection to bypass hover freeze on screens
window.addEventListener('touchstart', function onTouchStart() {
    isTouchDevice = true;
    window.removeEventListener('touchstart', onTouchStart);
}, { passive: true });

// Function to start speech bubble message rotation
// Helper to get next message sequentially using localStorage
function getNextMessage(messagesArray, storageKey) {
    let index = parseInt(localStorage.getItem(storageKey) || '0');
    if (isNaN(index) || index >= messagesArray.length || index < 0) {
        index = 0;
    }
    const message = messagesArray[index];
    const nextIndex = (index + 1) % messagesArray.length;
    localStorage.setItem(storageKey, nextIndex.toString());
    return message;
}

// Function to start speech bubble message rotation
function startBubbleRotation(messagesArray, storageKey) {
    if (bubbleInterval) clearInterval(bubbleInterval);
    const bubbleElement = document.getElementById('vibes-gravity-bubble');
    const bubbleText = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;
    if (!bubbleText) return;
    
    let index = parseInt(localStorage.getItem(storageKey) || '0');
    if (isNaN(index) || index >= messagesArray.length || index < 0) {
        index = 0;
    }
    bubbleText.textContent = messagesArray[index];
    
    bubbleInterval = setInterval(() => {
        index = (index + 1) % messagesArray.length;
        localStorage.setItem(storageKey, index.toString());
        bubbleText.textContent = messagesArray[index];
    }, 7500); // Increased from 3.5s to 7.5s
}

// X and Discord sequential bubble systems
function startXAndDiscordBubbles() {
    if (xBubbleInterval) clearInterval(xBubbleInterval);
    if (discordBubbleInterval) clearInterval(discordBubbleInterval);

    const xBubbleElement = document.getElementById('vibes-x-bubble');
    const xBubbleText = xBubbleElement ? xBubbleElement.querySelector('.bubble-text') : null;
    if (xBubbleText) {
        let xIdx = parseInt(localStorage.getItem('vibebuild_msg_idx_x') || '0');
        if (isNaN(xIdx) || xIdx >= xMessages.length || xIdx < 0) xIdx = 0;
        xBubbleText.textContent = xMessages[xIdx];
        
        xBubbleInterval = setInterval(() => {
            xIdx = (xIdx + 1) % xMessages.length;
            localStorage.setItem('vibebuild_msg_idx_x', xIdx.toString());
            xBubbleText.textContent = xMessages[xIdx];
        }, 8500); // Increased from 4s to 8.5s
    }

    const discordBubbleElement = document.getElementById('vibes-discord-bubble');
    const discordBubbleText = discordBubbleElement ? discordBubbleElement.querySelector('.bubble-text') : null;
    if (discordBubbleText) {
        let dcIdx = parseInt(localStorage.getItem('vibebuild_msg_idx_discord') || '0');
        if (isNaN(dcIdx) || dcIdx >= discordMessages.length || dcIdx < 0) dcIdx = 0;
        discordBubbleText.textContent = discordMessages[dcIdx];
        
        discordBubbleInterval = setInterval(() => {
            dcIdx = (dcIdx + 1) % discordMessages.length;
            localStorage.setItem('vibebuild_msg_idx_discord', dcIdx.toString());
            discordBubbleText.textContent = discordMessages[dcIdx];
        }, 9000); // Increased from 4.5s to 9s
    }
}

// Crying functions
function startCrying() {
    if (cryingInterval) return;
    cryingInterval = setInterval(() => {
        const tear = document.createElement('div');
        tear.className = 'logo-tear';
        const offsetLeft = 15 + Math.random() * 30;
        const offsetTop = 50;
        tear.style.left = `${logoX + offsetLeft}px`;
        tear.style.top = `${logoY + offsetTop}px`;
        document.body.appendChild(tear);
        setTimeout(() => tear.remove(), 800);
    }, 150);
}

function stopCrying() {
    if (cryingInterval) {
        clearInterval(cryingInterval);
        cryingInterval = null;
    }
}

// Stuck state behavior — original (random edge stuck)
function triggerStuckState() {
    if (currentSlide === 10) return;
    
    isStuck = true;
    isTeasing = false;
    isLogoInteractive = false;
    
    stuckSide = Math.random() < 0.5 ? 'left' : 'right';
    const stuckY = Math.random() * (window.innerHeight - 250) + 120;
    
    if (stuckSide === 'left') {
        targetX = 20;
    } else {
        targetX = window.innerWidth - 80;
    }
    targetY = stuckY;
    
    if (bubbleInterval) clearInterval(bubbleInterval);
    const bubbleElement = document.getElementById('vibes-gravity-bubble');
    const bubbleText = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;
    if (bubbleText) {
        const nextMsg = getNextMessage(stuckMessages, 'vibebuild_msg_idx_stuck');
        bubbleText.textContent = nextMsg;
    }
}

// --- PAGE-BOUNDARY STUCK (mascot can't cross between landing pages) ---
function triggerPageBoundaryStuck(fromSlide, toSlide, direction) {
    if (toSlide === 10 || toSlide < 0) return;
    
    isStuck = true;
    isTeasing = false;
    isLogoInteractive = false;
    stuckAtPage = fromSlide;
    wallBangCount = 0;
    
    // Stuck on the edge where the page "boundary" is
    // Going forward → stuck on RIGHT edge (can't cross to next page)
    // Going backward → stuck on LEFT edge
    if (direction === 'forward') {
        stuckSide = 'right';
        targetX = window.innerWidth - 70;
    } else {
        stuckSide = 'left';
        targetX = 10;
    }
    
    // Center vertically for visibility
    targetY = window.innerHeight / 2 - 30 + (Math.random() * 60 - 30);
    
    // Show page-specific stuck message
    if (bubbleInterval) clearInterval(bubbleInterval);
    const bubbleEl = document.getElementById('vibes-gravity-bubble');
    const bubbleT = bubbleEl ? bubbleEl.querySelector('.bubble-text') : null;
    
    // Pick messages from the page's stuck array
    const pageIdx = Math.min(fromSlide, pageStuckMessages.length - 1);
    const pageMsgs = pageStuckMessages[pageIdx];
    const firstMsg = pageMsgs[Math.floor(Math.random() * pageMsgs.length)];
    
    if (bubbleT) {
        bubbleT.textContent = firstMsg;
    }
    
    // Start wall-banging animation — mascot repeatedly hits the wall
    startWallBanging(direction, pageIdx);
}

// --- WALL BANGING ANIMATION ---
function startWallBanging(direction, pageIdx) {
    if (wallBangInterval) clearInterval(wallBangInterval);
    
    const edgeX = direction === 'forward' ? window.innerWidth - 70 : 10;
    const bangOffset = direction === 'forward' ? -25 : 25;
    
    wallBangInterval = setInterval(() => {
        if (!isStuck) {
            clearInterval(wallBangInterval);
            wallBangInterval = null;
            return;
        }
        
        wallBangCount++;
        
        // Lunge toward wall then bounce back
        targetX = edgeX;
        setTimeout(() => {
            if (!isStuck) return;
            // Bounce back slightly
            targetX = edgeX + bangOffset;
            
            // Shake on impact
            if (gravityContainer) {
                gravityContainer.classList.add('shaking');
                setTimeout(() => gravityContainer.classList.remove('shaking'), 300);
            }
        }, 200);
        
        // Cycle through page-specific messages
        const pageMsgs = pageStuckMessages[Math.min(pageIdx, pageStuckMessages.length - 1)];
        const bubbleEl = document.getElementById('vibes-gravity-bubble');
        const bubbleT = bubbleEl ? bubbleEl.querySelector('.bubble-text') : null;
        if (bubbleT && pageMsgs) {
            bubbleT.textContent = pageMsgs[wallBangCount % pageMsgs.length];
        }
        
        // After 4+ bangs — mascot gets desperate, show extra drama
        if (wallBangCount === 4) {
            if (bubbleT) bubbleT.textContent = "*BANG BANG BANG* LET ME THROUGH!! 🔨🔨🔨";
        }
        if (wallBangCount === 6) {
            if (bubbleT) bubbleT.textContent = "I've been banging this wall for AGES! 😤🧱💥";
        }
        
        // After 8 bangs — break through automatically
        if (wallBangCount >= 8) {
            clearInterval(wallBangInterval);
            wallBangInterval = null;
            breakThroughWall(direction);
        }
        
    }, 1200); // Bang every 1.2 seconds
}

// --- BREAK THROUGH THE WALL ---
function breakThroughWall(direction) {
    isStuck = false;
    isTeasing = false;
    stuckAtPage = -1;
    wallBangCount = 0;
    
    // Dramatic breakthrough — dash to center of screen
    const centerX = window.innerWidth / 2 - 30;
    const centerY = window.innerHeight / 2;
    targetX = centerX;
    targetY = centerY;
    
    // Show breakthrough message
    const bubbleEl = document.getElementById('vibes-gravity-bubble');
    const bubbleT = bubbleEl ? bubbleEl.querySelector('.bubble-text') : null;
    if (bubbleT) {
        bubbleT.textContent = pageBreakthroughMessages[Math.floor(Math.random() * pageBreakthroughMessages.length)];
    }
    
    // Victory spin + sparkles
    if (gravityContainer) {
        gravityContainer.classList.add('spinning');
        setTimeout(() => gravityContainer.classList.remove('spinning'), 600);
    }
    
    // Resume following cursor after celebration
    setTimeout(() => {
        if (gravityContainer && !gravityContainer.classList.contains('falling')) {
            isLogoInteractive = true;
        }
        if (hasReadCreatorMessage) {
            startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
        } else {
            startBubbleRotation(preOpenMessages, 'vibebuild_msg_idx_pre');
        }
    }, 2000);
}

// --- SLIDER NAVIGATION LOGIC ---

function goToSlide(index) {
    // Clamp slide index
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    
    // Reset vertical scroll of the previous active slide back to top
    if (scrollableContainers[currentSlide]) {
        scrollableContainers[currentSlide].scrollTop = 0;
    }

    const previousSlide = currentSlide; // Track for page-boundary stuck direction
    currentSlide = index;

    // Transition container horizontally
    sliderContainer.style.transform = `translateX(calc(-100vw * ${currentSlide}))`;

    // Update UI Elements
    slideBadge.textContent = `${(currentSlide + 1).toString().padStart(2, '0')} / ${totalSlides}`;
    designSelect.value = currentSlide;

    // Toggle button disabled states
    btnPrev.disabled = (currentSlide === 0);
    btnNext.disabled = (currentSlide === totalSlides - 1);
    
    // Style buttons on disabled state
    btnPrev.style.opacity = (currentSlide === 0) ? '0.4' : '1';
    btnPrev.style.pointerEvents = (currentSlide === 0) ? 'none' : 'auto';
    btnNext.style.opacity = (currentSlide === totalSlides - 1) ? '0.4' : '1';
    btnNext.style.pointerEvents = (currentSlide === totalSlides - 1) ? 'none' : 'auto';

    // Track slide direction for page-boundary stuck
    const slideDirection = index > previousSlide ? 'forward' : 'backward';
    
    // Slide 10 (Review Page) specific logo interaction & crying effect
    if (currentSlide === 10) {
        // Stop any wall banging
        if (wallBangInterval) { clearInterval(wallBangInterval); wallBangInterval = null; }
        isLogoInteractive = false;
        isStuck = false;
        isTeasing = false;
        targetX = 20;
        targetY = 20;
        startCrying();
        startBubbleRotation(cryingMessages, 'vibebuild_msg_idx_cry');
    } else {
        stopCrying();
        
        // Page-Boundary Stuck: 45% chance when switching between landing pages (slides 0-9)
        // Only trigger if actually changing slides (not loading same slide)
        if (previousSlide !== index && previousSlide < 10 && Math.random() < 0.45) {
            triggerPageBoundaryStuck(previousSlide, index, slideDirection);
        }
        // Original random edge stuck: 20% chance on remaining cases
        else if (Math.random() < 0.20) {
            triggerStuckState();
        } else {
            // Clean state — stop any wall banging
            if (wallBangInterval) { clearInterval(wallBangInterval); wallBangInterval = null; }
            isStuck = false;
            isTeasing = false;
            stuckAtPage = -1;
            // Only return to follow mode if it's no longer falling
            if (gravityContainer && !gravityContainer.classList.contains('falling')) {
                isLogoInteractive = true;
            }
            if (hasReadCreatorMessage) {
                startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
            } else {
                startBubbleRotation(preOpenMessages, 'vibebuild_msg_idx_pre');
            }
        }
    }
    // ── SUPABASE: Track page view on slide change ─────
    if (typeof VB !== 'undefined' && VB.trackPageView) {
        VB.trackPageView(currentSlide);
    }
}

// Button Events
btnPrev.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
});

btnNext.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
});

// Dropdown Change Event
designSelect.addEventListener('change', (e) => {
    goToSlide(parseInt(e.target.value));
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Only trigger if user is not typing in a text field
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
    }

    if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp') {
        if (scrollableContainers[currentSlide]) {
            scrollableContainers[currentSlide].scrollBy({ top: -120, behavior: 'smooth' });
            e.preventDefault();
        }
    } else if (e.key === 'ArrowDown') {
        if (scrollableContainers[currentSlide]) {
            scrollableContainers[currentSlide].scrollBy({ top: 120, behavior: 'smooth' });
            e.preventDefault();
        }
    } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'PageDown') {
        if (scrollableContainers[currentSlide]) {
            scrollableContainers[currentSlide].scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
            e.preventDefault();
        }
    } else if (e.key === 'PageUp') {
        if (scrollableContainers[currentSlide]) {
            scrollableContainers[currentSlide].scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
            e.preventDefault();
        }
    } else if (e.key === 'Home') {
        if (scrollableContainers[currentSlide]) {
            scrollableContainers[currentSlide].scrollTo({ top: 0, behavior: 'smooth' });
            e.preventDefault();
        }
    } else if (e.key === 'End') {
        if (scrollableContainers[currentSlide]) {
            scrollableContainers[currentSlide].scrollTo({ top: scrollableContainers[currentSlide].scrollHeight, behavior: 'smooth' });
            e.preventDefault();
        }
    }
});


// ========================================================
// INTERACTIVE WIDGET LOGIC
// ========================================================

// 1. ZenSpace Duration Poll (Slide 0)
const pollOptions = document.querySelectorAll('.poll-option');
let hasVoted = false;

pollOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (hasVoted) return;
        
        hasVoted = true;
        
        // Increment votes for selected option
        const selectedVotes = parseInt(option.getAttribute('data-votes')) + 1;
        option.setAttribute('data-votes', selectedVotes);
        option.classList.add('voted');

        // Sum total votes
        let totalVotes = 0;
        pollOptions.forEach(opt => {
            totalVotes += parseInt(opt.getAttribute('data-votes'));
        });

        // Calculate and render percentages
        pollOptions.forEach(opt => {
            const votes = parseInt(opt.getAttribute('data-votes'));
            const percent = Math.round((votes / totalVotes) * 100);
            
            const fill = opt.querySelector('.progress-bar-fill');
            const label = opt.querySelector('.percent-label');
            
            fill.style.width = `${percent}%`;
            label.textContent = `${percent}%`;
            opt.style.cursor = 'default';
        });
    });
});

// 2. AetherCrypt Payout Calculator (Slide 1)
const hackerSlider = document.getElementById('hacker-slider-1');
const hackerCountLabel = document.getElementById('hacker-count-label-1');
const pFirst = document.getElementById('p-first-1');
const pSecond = document.getElementById('p-second-1');
const pThird = document.getElementById('p-third-1');
const pRefund = document.getElementById('p-refund-1');

if (hackerSlider) {
    hackerSlider.addEventListener('input', (e) => {
        const hackers = parseInt(e.target.value);
        hackerCountLabel.textContent = hackers.toLocaleString();
        
        // Calculate based on user notebook parameters:
        // 1st: $750 (for 1000 devs), scale linearly -> 0.75 * N
        // 2nd: $500 (for 1000 devs) -> 0.5 * N
        // 3rd: $200 (for 1000 devs) -> 0.2 * N
        // Refund: 60% of devs split into $8, $6, $4 brackets
        const prize1 = Math.round(0.75 * hackers);
        const prize2 = Math.round(0.50 * hackers);
        const prize3 = Math.round(0.20 * hackers);
        
        const refundDevs = Math.floor(0.60 * hackers);
        const r100 = Math.floor(0.10 * hackers);
        const r200 = Math.floor(0.20 * hackers);
        const r300 = Math.floor(0.30 * hackers);

        pFirst.textContent = `$${prize1.toLocaleString()}`;
        pSecond.textContent = `$${prize2.toLocaleString()}`;
        pThird.textContent = `$${prize3.toLocaleString()}`;
        pRefund.textContent = `${refundDevs} Devs ($8-$4 back)`;
    });
}

// 3. Double-Blind Rating Sliders (Slide 3 & Slide 5)
const sliderWidgets = document.querySelectorAll('.interactive-sliders-widget');
sliderWidgets.forEach(widget => {
    const inputs = widget.querySelectorAll('.rating-input');
    const scoreDisplay = widget.querySelector('.calc-final-score');
    
    function calculate() {
        let finalScore = 0;
        inputs.forEach(input => {
            const val = parseInt(input.value);
            const weight = parseFloat(input.getAttribute('data-weight'));
            finalScore += val * weight;
            
            // Update individual label
            const row = input.closest('.slider-row');
            if (row) {
                const label = row.querySelector('.val-label');
                label.textContent = `${val}/10`;
            }
        });
        
        if (scoreDisplay) {
            scoreDisplay.textContent = `${finalScore.toFixed(2)} / 10`;
        }
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', calculate);
    });
    
    calculate(); // Initial calculation
});

// 4. Edumind Badge Stepper (Slide 7)
const stepBtns = document.querySelectorAll('.step-btn');
const stepContents = document.querySelectorAll('.step-content');

stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        
        // Deactivate all
        stepBtns.forEach(b => b.classList.remove('active'));
        stepContents.forEach(c => c.classList.remove('active'));
        
        // Activate selected
        btn.classList.add('active');
        const content = document.getElementById(target);
        if (content) {
            content.classList.add('active');
        }
    });
});

// 5. Constraint Page Random Brief Generator (Slide 6)
const targetUsers = [
    "Freelancer building a portfolio",
    "E-commerce customer checking out",
    "Content creator sharing a post",
    "Non-developer using AI to ship",
    "Student looking for scholarship runs",
    "Indie hacker launching a SaaS",
    "Remote team lead tracking sprints"
];

const requirements = [
    "A clean dark mode dashboard with interactive charts",
    "A responsive slider interface for peer reviews",
    "A timeline stepper showing badge milestones",
    "A payout simulator with range input scales",
    "A zero-paywall live link landing page layout",
    "A collaborative dynamic voting poll module"
];

const specialRules = [
    "Must limit build execution time to 3.0 hours max",
    "Must write clean semantic code with no external JS dependencies",
    "Must support the 11th free entry streak protection",
    "Must implement double-blind anonymity (no names allowed)"
];

const btnGenerateBrief = document.getElementById('btn-generate-brief');
const briefOutput = document.getElementById('brief-output');

if (btnGenerateBrief && briefOutput) {
    btnGenerateBrief.addEventListener('click', () => {
        const user = targetUsers[Math.floor(Math.random() * targetUsers.length)];
        const req = requirements[Math.floor(Math.random() * requirements.length)];
        const rule = specialRules[Math.floor(Math.random() * specialRules.length)];

        briefOutput.innerHTML = `
            <p style="margin-bottom: 8px;"><strong>🎯 Target User:</strong> ${user}</p>
            <p style="margin-bottom: 8px;"><strong>⚙️ Core Requirement:</strong> ${req}</p>
            <p><strong>⚠️ Special Rule:</strong> ${rule}</p>
        `;
    });
}

// Initial Setup
goToSlide(0);

// 6. Share & Earn Link Submission Handler
const shareButtons = document.querySelectorAll('.share-submit-btn');

shareButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const container = btn.closest('.share-box-container');
        if (!container) return;
        
        const input = container.querySelector('.share-input');
        if (!input) return;
        
        const urlValue = input.value.trim();
        if (!urlValue) {
            alert("Please paste a valid social post URL first.");
            return;
        }
        
        // Basic URL validation
        try {
            new URL(urlValue);
        } catch (_) {
            alert("Please enter a fully qualified URL (e.g. https://twitter.com/user/status/...)");
            return;
        }
        
        // Replace form with success message styled by CSS
        const parent = container.parentElement;
        if (parent) {
            container.style.display = 'none';
            const msg = document.createElement('div');
            msg.className = 'share-success-msg';
            msg.innerHTML = `<span>✓</span> Link submitted! Views verification begins now. Payout scheduled in 24 hours.`;
            parent.appendChild(msg);
        }
    });
});

// --- STAR RATING & NAVIGATION LOGIC ---

// Next Design Buttons Click Handlers
const nextSlideBtns = document.querySelectorAll('.btn-slide-next');
nextSlideBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
});

// Session management
let sessionId = localStorage.getItem('vibebuild_session_id');
if (!sessionId) {
    sessionId = 'live_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('vibebuild_session_id', sessionId);
}

// Sync ratings to KVdb database
let syncTimeout = null;
function syncRatingsToDatabase() {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        try {
            const localRatings = JSON.parse(localStorage.getItem('vibebuild_ratings') || '{}');
            const ratingsArray = [];
            Object.keys(localRatings).forEach(slideIdx => {
                ratingsArray.push({
                    slideIndex: parseInt(slideIdx),
                    designRating: localRatings[slideIdx].design || 0,
                    contentRating: localRatings[slideIdx].content || 0
                });
            });

            if (ratingsArray.length === 0) return;

            // Fetch existing feedbacks from KVdb
            const response = await fetch('https://kvdb.io/9JMToPARQ6WrW4wFKbZ743/feedbacks');
            let feedbacks = [];
            if (response.ok) {
                feedbacks = await response.json();
            }

            // Find existing session review
            const existingIndex = feedbacks.findIndex(fb => fb.id === 'session_' + sessionId);
            const reviewObj = {
                id: 'session_' + sessionId,
                timestamp: new Date().toISOString(),
                favoritePage: ratingsArray[0].slideIndex,
                suggestions: "Live ratings from showcase visitor.",
                questions: "Anonymous live visitor session ratings.",
                socialLink: "",
                status: "Pending",
                email: localStorage.getItem('vibebuild_user_email') || '',
                ratings: ratingsArray
            };

            if (existingIndex >= 0) {
                feedbacks[existingIndex].ratings = ratingsArray;
                feedbacks[existingIndex].timestamp = new Date().toISOString();
            } else {
                feedbacks.unshift(reviewObj);
            }

            // Save back to KVdb
            await fetch('https://kvdb.io/9JMToPARQ6WrW4wFKbZ743/feedbacks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbacks)
            });
            console.log('Live ratings synced to KVdb.');
        } catch (err) {
            console.error('Error syncing ratings:', err);
        }
    }, 1000);
}

// Star Rating Interactive Logic
const starsWrappers = document.querySelectorAll('.stars-wrapper');
starsWrappers.forEach(wrapper => {
    const stars = wrapper.querySelectorAll('.star-btn');
    const ratingValueLabel = wrapper.closest('.rating-header').querySelector('.rating-value');
    
    stars.forEach(star => {
        // Hover effects
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= val) {
                    s.classList.add('hover-active');
                } else {
                    s.classList.remove('hover-active');
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover-active'));
        });
        
        // Click to set rating
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= val) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            if (ratingValueLabel) {
                ratingValueLabel.textContent = `${val}/10`;
            }

            // Save to localStorage
            const slideIndex = parseInt(wrapper.getAttribute('data-slide-index'));
            const type = wrapper.classList.contains('design-stars') ? 'design' : 'content';
            const localRatings = JSON.parse(localStorage.getItem('vibebuild_ratings') || '{}');
            if (!localRatings[slideIndex]) {
                localRatings[slideIndex] = { design: 0, content: 0 };
            }
            localRatings[slideIndex][type] = val;
            localStorage.setItem('vibebuild_ratings', JSON.stringify(localRatings));
            
            // Sync to remote database
            syncRatingsToDatabase();

            // ── SUPABASE: Save rating ─────────────────────
            if (typeof VB !== 'undefined' && VB.saveRating) {
                const lr = JSON.parse(localStorage.getItem('vibebuild_ratings') || '{}');
                const dr = (lr[slideIndex] && lr[slideIndex].design) || 0;
                const cr = (lr[slideIndex] && lr[slideIndex].content) || 0;
                if (dr > 0 && cr > 0) {
                    VB.saveRating(slideIndex, dr, cr).then(res => {
                        if (res.success) showVBToast('⭐ Rating saved!', 'success');
                    });
                }
            }
        });
    });
});

// Slide 10 Feedback Form Submission
const btnSubmitFeedback = document.getElementById('btn-submit-feedback');
if (btnSubmitFeedback) {
    btnSubmitFeedback.addEventListener('click', async () => {
        const bestPageSelect = document.getElementById('best-page-select');
        const upgradeSuggestions = document.getElementById('upgrade-suggestions');
        const userQuestions = document.getElementById('user-questions');
        const socialPostLink = document.getElementById('social-post-link');
        const successMessage = document.getElementById('form-success-message');
        
        const bestPage = bestPageSelect.value;
        const suggestions = upgradeSuggestions.value.trim();
        const doubts = userQuestions.value.trim();
        const urlValue = socialPostLink.value.trim();
        
        if (!bestPage) {
            alert("Please select which landing page design you liked the most.");
            return;
        }
        if (!suggestions) {
            alert("Please suggest what upgrades or changes are needed for the designs.");
            return;
        }
        if (!doubts) {
            alert("Please enter any questions or doubts you have about VibeBuild.");
            return;
        }
        
        if (urlValue) {
            try {
                new URL(urlValue);
            } catch (_) {
                alert("Please enter a fully qualified URL (e.g. https://twitter.com/...)");
                return;
            }
        }
        
        // Build ratings array from localStorage
        const localRatings = JSON.parse(localStorage.getItem('vibebuild_ratings') || '{}');
        const ratingsArray = [];
        Object.keys(localRatings).forEach(slideIdx => {
            ratingsArray.push({
                slideIndex: parseInt(slideIdx),
                designRating: localRatings[slideIdx].design || 0,
                contentRating: localRatings[slideIdx].content || 0
            });
        });

        // Get user email if captured
        const userEmail = localStorage.getItem('vibebuild_user_email') || '';

        // Create full review object matching admin dashboard schema
        const reviewObj = {
            id: 'session_' + sessionId,
            timestamp: new Date().toISOString(),
            favoritePage: parseInt(bestPage),
            suggestions: suggestions,
            questions: doubts,
            socialLink: urlValue,
            status: "Pending",
            email: userEmail,
            ratings: ratingsArray
        };

        // Save to KVdb
        try {
            const response = await fetch('https://kvdb.io/9JMToPARQ6WrW4wFKbZ743/feedbacks');
            let feedbacks = [];
            if (response.ok) {
                feedbacks = await response.json();
            }

            // Replace existing session entry or add new
            const existingIndex = feedbacks.findIndex(fb => fb.id === reviewObj.id);
            if (existingIndex >= 0) {
                feedbacks[existingIndex] = reviewObj;
            } else {
                feedbacks.unshift(reviewObj);
            }

            await fetch('https://kvdb.io/9JMToPARQ6WrW4wFKbZ743/feedbacks', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbacks)
            });
            console.log('Feedback saved to KVdb successfully!');
        } catch (err) {
            console.error('Error saving feedback to KVdb:', err);
        }

        // ── SUPABASE: Save feedback ───────────────────
        if (typeof VB !== 'undefined' && VB.saveFeedback) {
            const bestPageNames = [
                '1. Direct & Bold (ZenSpace)', '2. Problem-First (AetherCrypt)',
                '3. Inclusive (NovusSaaS)', '4. Speed Angle (VeloceFit)',
                '5. Transparency Angle (CaffeineCo)', '6. Community Power (NebulaAgency)',
                '7. Constraint Angle (SentriShield)', '8. Outcome Angle (Edumind)',
                '9. Retention Angle (TerraTravel)', '10. Minimal & Direct (Aerospace)'
            ];
            VB.saveFeedback({
                bestPage: parseInt(bestPage),
                bestPageName: bestPageNames[parseInt(bestPage)] || '',
                suggestions: suggestions,
                questions: doubts,
                socialLink: urlValue
            }).then(res => {
                if (res.success) showVBToast('✅ Feedback saved to database!', 'success');
            });
        }
        
        const formCard = document.querySelector('.feedback-form-card');
        if (formCard) {
            // Hide all input fields and submit button
            const formGroups = formCard.querySelectorAll('.form-group, .btn-submit-form');
            formGroups.forEach(el => el.style.display = 'none');
            
            successMessage.className = 'feedback-success-msg';
            successMessage.style.display = 'flex';
            
            let payoutText = "";
            if (urlValue) {
                payoutText = "<br><strong>Payout Claimed:</strong> Social post verification in progress. Payout scheduled in 24 hours.";
            } else {
                payoutText = "<br>No payout claim submitted (empty link).";
            }
            
            successMessage.innerHTML = `
                <div>
                    <span style="font-size: 20px; font-weight: bold; color: #10b981; margin-right: 8px;">✓</span>
                    <strong>Feedback submitted successfully!</strong><br>
                    Thank you for your valuable feedback. Your review will help shape VibeBuild.
                    ${payoutText}
                </div>
            `;
        }
    });
}

// ========================================================
// CTA BUTTONS → DISCORD LINK (Fix 3)
// ========================================================
const DISCORD_LINK = 'https://discord.gg/vibebuild'; // Replace with actual Discord invite

const ctaButtons = document.querySelectorAll('.btn-main, .btn-neon, .btn-primary, .btn-orbit-main, .btn-gradient-action, .btn-glass, .btn-warm-cta, .btn-solid');
ctaButtons.forEach(btn => {
    // Don't override buttons that already have specific handlers
    if (btn.classList.contains('btn-slide-next') || 
        btn.classList.contains('btn-submit-form') ||
        btn.id === 'btn-submit-feedback' ||
        btn.id === 'btn-generate-brief') return;
    
    btn.addEventListener('click', (e) => {
        window.open(DISCORD_LINK, '_blank');
    });
});

// Nav CTA links
const navCtaLinks = document.querySelectorAll('.lp-btn-primary, .lp-btn-cta, .lp-btn-solid');
navCtaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(DISCORD_LINK, '_blank');
    });
});

// ========================================================
// FLOATING GRAVITY LOGO & CREATOR MODAL INTERACTIVITY
// ========================================================

// Initialize Lucide Icons for injected modal buttons
lucide.createIcons();

// Helper to transition the logo to interactive mode
function initializeInteractiveLogo() {
    if (gravityContainer && gravityContainer.classList.contains('falling')) {
        gravityContainer.classList.remove('falling');
    }
    if (xMascotContainer && xMascotContainer.classList.contains('falling')) {
        xMascotContainer.classList.remove('falling');
    }
    if (discordMascotContainer && discordMascotContainer.classList.contains('falling')) {
        discordMascotContainer.classList.remove('falling');
    }
    
    // Position it at the bottom left initially
    logoX = window.innerWidth * 0.05;
    logoY = window.innerHeight - 80;
    const isMobileInit = window.innerWidth < 768;
    const spacingInit = isMobileInit ? 70 : 120;
    xMascotX = logoX - spacingInit;
    xMascotY = logoY + 10;
    discordMascotX = logoX + spacingInit;
    discordMascotY = logoY + 10;
    
    if (isStuck) {
        // Keep the stuck coordinates and state intact
        return;
    }

    if (currentSlide === 10) {
        targetX = 20;
        targetY = 20;
        isLogoInteractive = false;
        startCrying();
        startBubbleRotation(cryingMessages, 'vibebuild_msg_idx_cry');
    } else {
        targetX = logoX;
        targetY = logoY;
        isLogoInteractive = true;
        if (hasReadCreatorMessage) {
            startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
        } else {
            startBubbleRotation(preOpenMessages, 'vibebuild_msg_idx_pre');
        }
    }

    startXAndDiscordBubbles();

    if (gravityContainer) {
        gravityContainer.style.left = `${logoX}px`;
        gravityContainer.style.top = `${logoY}px`;
    }
    if (xMascotContainer) {
        xMascotContainer.style.left = `${xMascotX}px`;
        xMascotContainer.style.top = `${xMascotY}px`;
    }
    if (discordMascotContainer) {
        discordMascotContainer.style.left = `${discordMascotX}px`;
        discordMascotContainer.style.top = `${discordMascotY}px`;
    }
}

// AnimationEnd Listener for Gravity Fall
if (gravityContainer) {
    gravityContainer.addEventListener('animationend', (e) => {
        if (e.animationName === 'gravity-fall') {
            initializeInteractiveLogo();
        }
    });

    // Fallback timer: Force interactive state after 2 seconds even if animationend event fails (critical for mobile support)
    setTimeout(() => {
        initializeInteractiveLogo();
        if (xMascotContainer) xMascotContainer.classList.remove('falling');
        if (discordMascotContainer) discordMascotContainer.classList.remove('falling');
    }, 2000);

    // Handle hover states for click convenience (Hover Freeze) - bypassed on touch devices to prevent getting stuck
    gravityContainer.addEventListener('mouseenter', () => {
        if (!isTouchDevice) {
            isHovered = true;
        }
    });
    
    gravityContainer.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Handle clicks to open the modal
    gravityContainer.addEventListener('click', () => {
        if (creatorModal) {
            creatorModal.classList.add('active');
            if (currentSlide !== 10 && !hasReadCreatorMessage) {
                hasReadCreatorMessage = true;
                startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
            }
        }
        // ── SUPABASE: Track mascot click ─────────────────
        if (typeof VB !== 'undefined' && VB.trackMascotEvent) {
            VB.trackMascotEvent('click', hasReadCreatorMessage ? 'post_open' : 'pre_open', currentSlide);
        }
    });
}

// X Mascot listeners
if (xMascotContainer) {
    xMascotContainer.addEventListener('animationend', (e) => {
        if (e.animationName === 'gravity-fall') {
            xMascotContainer.classList.remove('falling');
            startXAndDiscordBubbles();
        }
    });

    xMascotContainer.addEventListener('mouseenter', () => {
        if (!isTouchDevice) isXHovered = true;
    });

    xMascotContainer.addEventListener('mouseleave', () => {
        isXHovered = false;
    });

    xMascotContainer.addEventListener('click', () => {
        window.open('https://x.com/', '_blank');
    });
}

// Discord Mascot listeners
if (discordMascotContainer) {
    discordMascotContainer.addEventListener('animationend', (e) => {
        if (e.animationName === 'gravity-fall') {
            discordMascotContainer.classList.remove('falling');
            startXAndDiscordBubbles();
        }
    });

    discordMascotContainer.addEventListener('mouseenter', () => {
        if (!isTouchDevice) isDiscordHovered = true;
    });

    discordMascotContainer.addEventListener('mouseleave', () => {
        isDiscordHovered = false;
    });

    discordMascotContainer.addEventListener('click', () => {
        window.open(DISCORD_LINK, '_blank');
    });
}

// Handle mouse movement for physics spring follow
document.addEventListener('mousemove', (e) => {
    lastCursorX = e.clientX;
    lastCursorY = e.clientY;
    const isModalActive = creatorModal && creatorModal.classList.contains('active');
    if (isLogoInteractive && !isHovered && !isModalActive) {
        // Offset the target coordinates so the logo sits next to the cursor instead of directly under it
        targetX = e.clientX + 20;
        targetY = e.clientY + 20;
    }
});

// Handle touch movement for mobile devices
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        lastCursorX = e.touches[0].clientX;
        lastCursorY = e.touches[0].clientY;
    }
    const isModalActive = creatorModal && creatorModal.classList.contains('active');
    if (isLogoInteractive && !isHovered && !isModalActive && e.touches.length > 0) {
        targetX = e.touches[0].clientX + 10;
        targetY = e.touches[0].clientY + 10;
    }
}, { passive: true });

// Tick loop for smooth CSS updates
function tickLogoPhysics() {
    if (gravityContainer) {
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? 44 : 60;
        const isModalActive = creatorModal && creatorModal.classList.contains('active');
        
        // Escape check for stuck logo (Slide boundary stuck)
        if (isStuck && !isTeasing) {
            const dx = lastCursorX - logoX;
            const dy = lastCursorY - logoY;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 150) {
                isTeasing = true;
                if (stuckSide === 'left') {
                    stuckSide = 'right';
                    targetX = window.innerWidth - 80;
                } else {
                    stuckSide = 'left';
                    targetX = 20;
                }
                targetY = Math.max(120, Math.min(window.innerHeight - 150, targetY + (Math.random() * 120 - 60)));
                
                const bubbleElement = document.getElementById('vibes-gravity-bubble');
                const bubbleText = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;
                if (bubbleText) {
                    bubbleText.textContent = getNextMessage(teasingMessages, 'vibebuild_msg_idx_tease');
                }
                
                setTimeout(() => {
                    isStuck = false;
                    isTeasing = false;
                    removeAllRopes();
                    clearSideBubbleMoods();
                    if (gravityContainer && !gravityContainer.classList.contains('falling')) {
                        isLogoInteractive = true;
                    }
                    if (hasReadCreatorMessage) {
                        startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
                    } else {
                        startBubbleRotation(preOpenMessages, 'vibebuild_msg_idx_pre');
                    }
                }, 1500);
            }
        }

        // Bypassed if currently falling (CSS handles falling)
        const mainFalling = gravityContainer.classList.contains('falling');
        const xFalling = xMascotContainer && xMascotContainer.classList.contains('falling');
        const dFalling = discordMascotContainer && discordMascotContainer.classList.contains('falling');

        if (!mainFalling && !xFalling && !dFalling) {
            
            // --- STUCK BOUNDARY RESCUE STATE ---
            if (isStuck) {
                // Main mascot hits boundary wall
                logoX += (targetX - logoX) * 0.08;
                logoY += (targetY - logoY) * 0.08;

                // X and Discord stand close to pull main back
                const rescueOffset = stuckSide === 'left' ? 60 : -60;
                
                if (xMascotContainer) {
                    xMascotX += ((logoX + rescueOffset) - xMascotX) * 0.08;
                    xMascotY += (logoY - xMascotY) * 0.08;
                }
                if (discordMascotContainer) {
                    discordMascotX += ((logoX + rescueOffset * 1.8) - discordMascotX) * 0.08;
                    discordMascotY += (logoY - discordMascotY) * 0.08;
                }
            }

            // --- DRIFT/WANDERING CENTER (WALKING AT BOTTOM) ---
            else {
                groundCenter = (window.innerWidth / 2) + Math.sin(Date.now() / 3500) * (window.innerWidth * 0.22);
            }
            const groundY = window.innerHeight - size - (isMobile ? 12 : 25);
            const bobbingSpeed = 400; // ms per bob cycles

            // --- PUSH RESCUE STATE MACHINE ---
            if (pushedOffMascot !== null) {
                // Ground targets for the two bullies/saviors
                const saviorTargets = {
                    main: { x: groundCenter, y: groundY },
                    x: { x: groundCenter - (isMobile ? 70 : 120), y: groundY },
                    discord: { x: groundCenter + (isMobile ? 70 : 120), y: groundY }
                };

                // Move non-pushed mascots
                if (pushedOffMascot !== 'main') {
                    logoX += (saviorTargets.main.x - logoX) * 0.08;
                    logoY += (saviorTargets.main.y - logoY) * 0.08;
                }
                if (pushedOffMascot !== 'x' && xMascotContainer) {
                    xMascotX += (saviorTargets.x.x - xMascotX) * 0.08;
                    xMascotY += (saviorTargets.x.y - xMascotY) * 0.08;
                }
                if (pushedOffMascot !== 'discord' && discordMascotContainer) {
                    discordMascotX += (saviorTargets.discord.x - discordMascotX) * 0.08;
                    discordMascotY += (saviorTargets.discord.y - discordMascotY) * 0.08;
                }

                // Check user hover rescue near bottom
                if (rescueState === 'waiting_user') {
                    if (lastCursorY > window.innerHeight - 100) {
                        // User hovered near bottom to save them
                        triggerRescueSuccess(true);
                    }
                } else if (rescueState === 'self_rescuing') {
                    // Mascots pull victim back themselves
                    const victimTargetY = groundY;
                    let victimTargetX = groundCenter;
                    if (pushedOffMascot === 'x') victimTargetX = groundCenter - (isMobile ? 70 : 120);
                    if (pushedOffMascot === 'discord') victimTargetX = groundCenter + (isMobile ? 70 : 120);

                    if (pushedOffMascot === 'main') {
                        logoX += (victimTargetX - logoX) * 0.05;
                        logoY += (victimTargetY - logoY) * 0.05;
                    } else if (pushedOffMascot === 'x') {
                        xMascotX += (victimTargetX - xMascotX) * 0.05;
                        xMascotY += (victimTargetY - xMascotY) * 0.05;
                    } else if (pushedOffMascot === 'discord') {
                        discordMascotX += (victimTargetX - discordMascotX) * 0.05;
                        discordMascotY += (victimTargetY - discordMascotY) * 0.05;
                    }
                }
            }
            
            // --- ACTIVE CURSOR FOLLOWER PHYSICS ---
            else if (activeFollowerId !== null) {
                // Get ground positions for the other two mascots
                const targetM = { x: groundCenter, y: groundY + Math.sin(Date.now() / bobbingSpeed) * 5 };
                const targetXVal = { x: groundCenter - (isMobile ? 70 : 120), y: groundY + Math.sin(Date.now() / bobbingSpeed + 1) * 5 };
                const targetDVal = { x: groundCenter + (isMobile ? 70 : 120), y: groundY + Math.sin(Date.now() / bobbingSpeed + 2) * 5 };

                // Apply standard ground positioning to non-followers
                if (activeFollowerId !== 'main') {
                    logoX += (targetM.x - logoX) * 0.08;
                    logoY += (targetM.y - logoY) * 0.08;
                }
                if (activeFollowerId !== 'x' && xMascotContainer) {
                    xMascotX += (targetXVal.x - xMascotX) * 0.08;
                    xMascotY += (targetXVal.y - xMascotY) * 0.08;
                }
                if (activeFollowerId !== 'discord' && discordMascotContainer) {
                    discordMascotX += (targetDVal.x - discordMascotX) * 0.08;
                    discordMascotY += (targetDVal.y - discordMascotY) * 0.08;
                }

                // Follower position calculations
                let targetFollowerX = lastCursorX - size / 2;
                let targetFollowerY = lastCursorY - size / 2;

                // Midpoint of the two grounded mascots (tension center)
                let tensionCenterX = groundCenter;
                let tensionCenterY = groundY;
                if (activeFollowerId === 'main') {
                    tensionCenterX = (xMascotX + discordMascotX) / 2;
                    tensionCenterY = (xMascotY + discordMascotY) / 2;
                } else if (activeFollowerId === 'x') {
                    tensionCenterX = (logoX + discordMascotX) / 2;
                    tensionCenterY = (logoY + discordMascotY) / 2;
                } else if (activeFollowerId === 'discord') {
                    tensionCenterX = (logoX + xMascotX) / 2;
                    tensionCenterY = (logoY + xMascotY) / 2;
                }

                // Apply rubber-band tension force (pulling mascot down to friends)
                targetFollowerX += (tensionCenterX - targetFollowerX) * 0.15;
                targetFollowerY += (tensionCenterY - targetFollowerY) * 0.15;

                // Interpolate follower position
                if (activeFollowerId === 'main') {
                    logoX += (targetFollowerX - logoX) * 0.08;
                    logoY += (targetFollowerY - logoY) * 0.08;
                } else if (activeFollowerId === 'x' && xMascotContainer) {
                    xMascotX += (targetFollowerX - xMascotX) * 0.08;
                    xMascotY += (targetFollowerY - xMascotY) * 0.08;
                } else if (activeFollowerId === 'discord' && discordMascotContainer) {
                    discordMascotX += (targetFollowerX - discordMascotX) * 0.08;
                    discordMascotY += (targetFollowerY - discordMascotY) * 0.08;
                }

                // Check slip logic: if user drags cursor too far (> 350px distance) from follower mascot
                const currentFollowerX = activeFollowerId === 'main' ? logoX : (activeFollowerId === 'x' ? xMascotX : discordMascotX);
                const currentFollowerY = activeFollowerId === 'main' ? logoY : (activeFollowerId === 'x' ? xMascotY : discordMascotY);
                const distToCursor = Math.hypot(lastCursorX - (currentFollowerX + size / 2), lastCursorY - (currentFollowerY + size / 2));
                
                if (distToCursor > 350 && !isModalActive) {
                    // Slip grip! Mascot falls back down
                    const victimId = activeFollowerId;
                    const slipMsgs = ["Ouch, slipped! 🫨💫", "Whoops! Too fast! 🌪️", "Ah, gravity wins! 🌌🙃", "The rope snapped! 🪢💥"];
                    const msg = slipMsgs[Math.floor(Math.random() * slipMsgs.length)];
                    if (victimId === 'main') showQuickMessage(msg, 'shock', 2500);
                    else if (victimId === 'x') setXBubble(msg);
                    else setDiscordBubble(msg);
                    endRopeCapture(); // resets activeFollowerId and removes ropes
                }
            }
            
            // --- IDLE WANDERING PHYSICS (NO ACTIVE FOLLOWER) ---
            else {
                // Target ground coordinates with separate offset bobs
                const targetM = { x: groundCenter, y: groundY + Math.sin(Date.now() / bobbingSpeed) * 5 };
                const targetXVal = { x: groundCenter - (isMobile ? 70 : 120), y: groundY + Math.sin(Date.now() / bobbingSpeed + 1.2) * 5 };
                const targetDVal = { x: groundCenter + (isMobile ? 70 : 120), y: groundY + Math.sin(Date.now() / bobbingSpeed + 2.4) * 5 };

                // Smoothly walk/interpolate towards targets
                logoX += (targetM.x - logoX) * 0.08;
                logoY += (targetM.y - logoY) * 0.08;

                if (xMascotContainer) {
                    xMascotX += (targetXVal.x - xMascotX) * 0.08;
                    xMascotY += (targetXVal.y - xMascotY) * 0.08;
                }
                if (discordMascotContainer) {
                    discordMascotX += (targetDVal.x - discordMascotX) * 0.08;
                    discordMascotY += (targetDVal.y - discordMascotY) * 0.08;
                }

                // Proximity detector: check if cursor is close to any mascot to trigger follow
                if (interactionState === 'idle' && !isStuck && !isModalActive) {
                    const dists = {
                        main: Math.hypot(lastCursorX - (logoX + size / 2), lastCursorY - (logoY + size / 2)),
                        x: xMascotContainer ? Math.hypot(lastCursorX - (xMascotX + size / 2), lastCursorY - (xMascotY + size / 2)) : 9999,
                        discord: discordMascotContainer ? Math.hypot(lastCursorX - (discordMascotX + size / 2), lastCursorY - (discordMascotY + size / 2)) : 9999
                    };

                    const closest = Object.entries(dists).sort((a, b) => a[1] - b[1])[0];
                    if (closest[1] < 45) {
                        // Trigger follow capture!
                        startRopeCapture(closest[0]);
                    }
                }
            }

            // --- BOUNDARIES RESTRICTIONS ---
            // Ensure no mascot flies off screen (except pushed off ones)
            if (pushedOffMascot !== 'main') {
                logoX = Math.max(10, Math.min(window.innerWidth - size - 10, logoX));
                logoY = Math.max(10, Math.min(window.innerHeight - size - 10, logoY));
            }
            if (xMascotContainer && pushedOffMascot !== 'x') {
                xMascotX = Math.max(10, Math.min(window.innerWidth - size - 10, xMascotX));
                xMascotY = Math.max(10, Math.min(window.innerHeight - size - 10, xMascotY));
            }
            if (discordMascotContainer && pushedOffMascot !== 'discord') {
                discordMascotX = Math.max(10, Math.min(window.innerWidth - size - 10, discordMascotX));
                discordMascotY = Math.max(10, Math.min(window.innerHeight - size - 10, discordMascotY));
            }

            // Apply positions to HTML DOM
            gravityContainer.style.left = `${logoX}px`;
            gravityContainer.style.top = `${logoY}px`;
            if (xMascotContainer) {
                xMascotContainer.style.left = `${xMascotX}px`;
                xMascotContainer.style.top = `${xMascotY}px`;
            }
            if (discordMascotContainer) {
                discordMascotContainer.style.left = `${discordMascotX}px`;
                discordMascotContainer.style.top = `${discordMascotY}px`;
            }
        }
    }
    requestAnimationFrame(tickLogoPhysics);
}
requestAnimationFrame(tickLogoPhysics);

// Modal Close Handlers
function closeCreatorModal() {
    if (creatorModal) {
        creatorModal.classList.remove('active');
        if (currentSlide !== 10 && !hasReadCreatorMessage) {
            hasReadCreatorMessage = true;
            startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
        }
    }
}

if (modalClose) {
    modalClose.addEventListener('click', closeCreatorModal);
}
if (modalThanks) {
    modalThanks.addEventListener('click', closeCreatorModal);
}

// Close modal when clicking on the overlay background
if (creatorModal) {
    creatorModal.addEventListener('click', (e) => {
        if (e.target === creatorModal) {
            closeCreatorModal();
        }
    });
}

// Initial bubble text setup on load
if (currentSlide === 10) {
    isLogoInteractive = false;
    targetX = 20;
    targetY = 20;
    startCrying();
    startBubbleRotation(cryingMessages, 'vibebuild_msg_idx_cry');
} else {
    // Start standard cute request bubble rotation
    startBubbleRotation(preOpenMessages, 'vibebuild_msg_idx_pre');
    startXAndDiscordBubbles();
}

// ========================================================
// ENHANCED MASCOT BEHAVIOR ENGINE
// ========================================================

const faceEl = document.getElementById('vibes-gravity-face');
const bubbleElement = document.getElementById('vibes-gravity-bubble');
const bubbleTextEl = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;

// --- EMOJI FACE SYSTEM ---
const moodFaces = {
    normal: '',
    happy: '😊',
    love: '🥰',
    angry: '😡',
    rage: '🤬',
    sleepy: '😴',
    jealous: '😤',
    sassy: '💅',
    excited: '🤩',
    crying: '😭',
    shock: '😱',
    smirk: '😏',
    peek: '🫣',
    clingy: '🥺',
    dead: '💀'
};

let currentMood = 'normal';
let moodTimeout = null;

function setMood(mood, duration = 0) {
    // Clear all existing mood classes
    const moods = ['mood-happy', 'mood-angry', 'mood-love', 'mood-sleepy', 'mood-jealous', 'mood-sassy'];
    moods.forEach(m => gravityLogo.classList.remove(m));
    
    currentMood = mood;
    
    // Set face emoji
    if (faceEl && moodFaces[mood] && mood !== 'normal') {
        faceEl.textContent = moodFaces[mood];
        faceEl.style.display = 'block';
        gravityLogo.classList.add('has-face');
    } else if (faceEl) {
        faceEl.style.display = 'none';
        gravityLogo.classList.remove('has-face');
    }
    
    // Set border glow
    if (mood === 'happy' || mood === 'excited') gravityLogo.classList.add('mood-happy');
    else if (mood === 'angry' || mood === 'rage') gravityLogo.classList.add('mood-angry');
    else if (mood === 'love' || mood === 'clingy') gravityLogo.classList.add('mood-love');
    else if (mood === 'sleepy') gravityLogo.classList.add('mood-sleepy');
    else if (mood === 'jealous') gravityLogo.classList.add('mood-jealous');
    else if (mood === 'sassy' || mood === 'smirk') gravityLogo.classList.add('mood-sassy');
    
    // Auto-reset mood after duration
    if (duration > 0) {
        if (moodTimeout) clearTimeout(moodTimeout);
        moodTimeout = setTimeout(() => {
            setMood('normal');
        }, duration);
    }
}

// --- BUBBLE MOOD STYLING ---
function setBubbleMood(mood) {
    if (!bubbleElement) return;
    bubbleElement.classList.remove('rage-bubble', 'love-bubble');
    if (mood === 'angry' || mood === 'rage' || mood === 'jealous') {
        bubbleElement.classList.add('rage-bubble');
    } else if (mood === 'love' || mood === 'clingy') {
        bubbleElement.classList.add('love-bubble');
    }
}

// --- SHOW QUICK MESSAGE (interrupts rotation temporarily) ---
function showQuickMessage(msg, mood, duration = 3000) {
    if (!bubbleTextEl) return;
    if (bubbleInterval) clearInterval(bubbleInterval);
    bubbleTextEl.textContent = msg;
    setMood(mood, duration);
    setBubbleMood(mood);
    
    setTimeout(() => {
        setBubbleMood('normal');
        // Resume normal rotation
        if (currentSlide !== 10) {
            if (hasReadCreatorMessage) {
                startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
            } else {
                startBubbleRotation(preOpenMessages, 'vibebuild_msg_idx_pre');
            }
        }
    }, duration);
}

// --- PARTICLE SPAWNER ---
function spawnParticle(type, count = 1) {
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        const ox = (Math.random() - 0.5) * 60;
        const oy = (Math.random() - 0.5) * 40;
        
        if (type === 'heart') {
            el.className = 'logo-heart';
            el.textContent = ['❤️', '💕', '💖', '💗', '💜'][Math.floor(Math.random() * 5)];
            el.style.setProperty('--hx', `${(Math.random() - 0.5) * 50}px`);
        } else if (type === 'sparkle') {
            el.className = 'logo-sparkle';
            el.textContent = ['✨', '⭐', '🌟', '💫', '🔥'][Math.floor(Math.random() * 5)];
            el.style.setProperty('--sx', `${(Math.random() - 0.5) * 60}px`);
            el.style.setProperty('--sy', `${-20 - Math.random() * 40}px`);
        } else if (type === 'fire') {
            el.className = 'logo-fire';
            el.textContent = ['🔥', '💢', '💥', '⚡'][Math.floor(Math.random() * 4)];
            el.style.setProperty('--fx', `${(Math.random() - 0.5) * 40}px`);
            el.style.setProperty('--fy', `${-15 - Math.random() * 30}px`);
        } else if (type === 'zzz') {
            el.className = 'logo-zzz';
            el.textContent = ['Z', 'z', 'Z'][Math.floor(Math.random() * 3)];
        }
        
        el.style.left = `${logoX + 30 + ox}px`;
        el.style.top = `${logoY + 10 + oy}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), type === 'zzz' ? 2000 : 1200);
    }
}

// --- ANIMATION STATE HELPERS ---
function triggerAnimation(name, duration) {
    if (!gravityContainer) return;
    gravityContainer.classList.add(name);
    setTimeout(() => {
        gravityContainer.classList.remove(name);
    }, duration);
}

// --- DODGE BEHAVIOR (runs away from cursor) ---
let dodgeCount = 0;
let isDodging = false;

function triggerDodge() {
    if (isDodging || isStuck || currentSlide === 10) return;
    isDodging = true;
    dodgeCount++;
    
    // Leave a ghost trail
    const trail = document.createElement('div');
    trail.className = 'logo-trail';
    trail.style.left = `${logoX}px`;
    trail.style.top = `${logoY}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 500);
    
    // Dash to opposite side of cursor
    const dashX = lastCursorX > window.innerWidth / 2 
        ? Math.random() * (window.innerWidth * 0.3) + 30
        : window.innerWidth - Math.random() * (window.innerWidth * 0.3) - 90;
    const dashY = Math.random() * (window.innerHeight - 200) + 100;
    
    targetX = dashX;
    targetY = dashY;
    isLogoInteractive = false;
    
    // Show dodge message
    const dodgeMsgs = [
        "You can't catch me! 😜⚡",
        "NOPE! Too slow! 🏃‍♂️💨",
        "Missed me! Try again! 😂",
        "I'm like the wind baby! 🌪️",
        "YOINK! Over here now! 🤪",
        "I have REFLEXES! 🥷"
    ];
    showQuickMessage(dodgeMsgs[Math.floor(Math.random() * dodgeMsgs.length)], 'sassy', 2000);
    spawnParticle('sparkle', 3);
    
    // Come back after a moment
    setTimeout(() => {
        isDodging = false;
        if (currentSlide !== 10 && !isStuck) {
            isLogoInteractive = true;
        }
        // After 3+ dodges, say something different
        if (dodgeCount >= 3) {
            showQuickMessage("Okay okay I'll stop running! You're persistent! 😅", 'happy', 3000);
            dodgeCount = 0;
        }
    }, 1800);
}

function triggerAttentionSeeking() {
    const mascots = ['main', 'x', 'discord'];
    const selected = mascots[Math.floor(Math.random() * 3)];
    
    // Jump animation
    const container = selected === 'main' ? gravityContainer : (selected === 'x' ? xMascotContainer : discordMascotContainer);
    if (container) {
        container.classList.add('celebrating');
        setTimeout(() => container.classList.remove('celebrating'), 600);
    }
    
    if (selected === 'main') {
        const msgs = ["Ahem! I'm right here! ⚔️👀", "Interact with me! 🥺", "Please notice me! 👉👈", "Look at me! 🤩"];
        showQuickMessage(msgs[Math.floor(Math.random() * msgs.length)], 'clingy', 4000);
    } else if (selected === 'x') {
        const msgs = ["Follow me on X! 𝕏✨", "Click me for trending info! 🕏", "Hey user, hover over me! 🥺", "Look at my cool logo! 𝕏"];
        setXBubble(msgs[Math.floor(Math.random() * msgs.length)], 'fight-bubble');
        setTimeout(() => {
            const xBubbleElement = document.getElementById('vibes-x-bubble');
            if (xBubbleElement) xBubbleElement.classList.remove('fight-bubble');
        }, 4000);
    } else {
        const msgs = ["Join our Discord! 💬", "Ping me for a surprise! 🔔", "Don't leave us hanging! 👾", "Come chat with me! 💬"];
        setDiscordBubble(msgs[Math.floor(Math.random() * msgs.length)], 'fight-bubble');
        setTimeout(() => {
            const discordBubbleElement = document.getElementById('vibes-discord-bubble');
            if (discordBubbleElement) discordBubbleElement.classList.remove('fight-bubble');
        }, 4000);
    }
    
    spawnParticle('sparkle', 2);
}

// --- IDLE DETECTION (user stops moving cursor) ---
let lastMoveTime = Date.now();
let idleStage = 0; // 0=active, 1=bored, 2=sleepy, 3=rage
let idleCheckInterval = null;
let sleepParticleInterval = null;

function startIdleDetection() {
    idleCheckInterval = setInterval(() => {
        if (currentSlide === 10 || isStuck || isDodging) return;
        
        const idleTime = Date.now() - lastMoveTime;
        
        // Stage 1: Bored (8 seconds idle)
        if (idleTime > 8000 && idleStage === 0) {
            idleStage = 1;
            triggerAttentionSeeking();
        }
        
        // Stage 2: Sleepy (20 seconds idle)
        if (idleTime > 20000 && idleStage === 1) {
            idleStage = 2;
            showQuickMessage(
                getNextMessage(sleepyMessages, 'vibebuild_msg_idx_sleepy'),
                'sleepy', 6000
            );
            triggerAnimation('sleeping', 6000);
            sleepParticleInterval = setInterval(() => spawnParticle('zzz', 1), 1500);
        }
        
        // Stage 3: RAGE BAIT (35 seconds idle) 
        if (idleTime > 35000 && idleStage === 2) {
            idleStage = 3;
            if (sleepParticleInterval) {
                clearInterval(sleepParticleInterval);
                sleepParticleInterval = null;
            }
            gravityContainer.classList.remove('sleeping');
            
            showQuickMessage(
                getNextMessage(rageBaitMessages, 'vibebuild_msg_idx_rage'),
                'rage', 5000
            );
            triggerAnimation('shaking', 3000);
            spawnParticle('fire', 4);
            
            // Grow big to be annoying!
            setTimeout(() => {
                if (idleStage === 3) {
                    triggerAnimation('growing', 2000);
                    showQuickMessage("I'M GETTING BIGGER! NOTICE ME!! 😈🔥", 'rage', 3000);
                }
            }, 3500);
        }
        
        // Stage 4: Ultimate rage (50 seconds idle)
        if (idleTime > 50000 && idleStage === 3) {
            idleStage = 4;
            // Move to center of screen
            targetX = window.innerWidth / 2 - 30;
            targetY = window.innerHeight / 2 - 30;
            isLogoInteractive = false;
            showQuickMessage("THAT'S IT! I'm taking over the screen! 💀🔥", 'dead', 5000);
            triggerAnimation('shaking', 5000);
            spawnParticle('fire', 6);
            
            setTimeout(() => {
                if (idleStage === 4) {
                    showQuickMessage("...okay fine I'll calm down 😮‍💨 just... move your mouse?", 'normal', 4000);
                    isLogoInteractive = true;
                    idleStage = 0;
                }
            }, 6000);
        }
        
    }, 2000);
}

// Reset idle on mouse move
const originalMouseMove = document.onmousemove;
document.addEventListener('mousemove', () => {
    const wasIdle = idleStage > 0;
    lastMoveTime = Date.now();
    
    if (wasIdle && idleStage >= 2) {
        // Wake up from sleep/rage
        gravityContainer.classList.remove('sleeping', 'shaking', 'growing');
        if (sleepParticleInterval) {
            clearInterval(sleepParticleInterval);
            sleepParticleInterval = null;
        }
        
        if (idleStage >= 3) {
            showQuickMessage("Oh NOW you move! Thanks for gracing me with your presence 🙄", 'sassy', 3000);
        } else {
            showQuickMessage("Oh! You're back! I was getting lonely... 🥺", 'happy', 2500);
            spawnParticle('sparkle', 2);
        }
    }
    
    idleStage = 0;
});

startIdleDetection();

// --- TAB VISIBILITY DETECTION (crying when user leaves) ---
let tabLeaveTime = null;

document.addEventListener('visibilitychange', () => {
    if (currentSlide === 10) return;
    
    if (document.hidden) {
        // User left the tab
        tabLeaveTime = Date.now();
        // We can't show messages while hidden, but set up for return
    } else {
        // User came back!
        if (tabLeaveTime) {
            const goneFor = Date.now() - tabLeaveTime;
            
            if (goneFor > 30000) {
                // Gone for 30+ seconds — dramatic return
                showQuickMessage(
                    getNextMessage(comeBackMessages, 'vibebuild_msg_idx_comeback'),
                    'love', 5000
                );
                triggerAnimation('bouncing', 3000);
                spawnParticle('heart', 5);
                setTimeout(() => spawnParticle('sparkle', 3), 500);
            } else if (goneFor > 5000) {
                // Gone for 5-30 seconds — mild clingy
                showQuickMessage(
                    getNextMessage(clingyMessages, 'vibebuild_msg_idx_clingy'),
                    'clingy', 3000
                );
                triggerAnimation('wiggling', 2000);
                spawnParticle('heart', 2);
            } else if (goneFor > 2000) {
                // Quick tab switch — jealous/suspicious
                const quickMsgs = [
                    "What was THAT tab about?! 👀",
                    "Oh visiting OTHER websites are we?! 😤",
                    "I know you were looking at other logos... 💔",
                    "Back already? Couldn't stay away huh? 😏"
                ];
                showQuickMessage(quickMsgs[Math.floor(Math.random() * quickMsgs.length)], 'jealous', 3000);
            }
            tabLeaveTime = null;
        }
    }
});

// --- JEALOUSY SYSTEM (detect clicks on other elements) ---
let jealousyCooldown = false;

document.addEventListener('click', (e) => {
    if (currentSlide === 10 || jealousyCooldown) return;
    
    // Check if click was NOT on the gravity logo
    const clickedLogo = e.target.closest('#vibes-gravity-logo-container');
    if (clickedLogo) {
        // User clicked the logo — show love!
        setMood('love', 3000);
        spawnParticle('heart', 4);
        triggerAnimation('bouncing', 1500);
        
        if (hasReadCreatorMessage) {
            // Already read — show appreciation
            showQuickMessage(
                getNextMessage(appreciateMessages, 'vibebuild_msg_idx_appreciate'),
                'love', 3000
            );
        }
        return;
    }
    
    // Click on stars (rating) — get excited!
    const clickedStar = e.target.closest('.star-btn');
    if (clickedStar) {
        setMood('excited', 2500);
        spawnParticle('sparkle', 3);
        triggerAnimation('bouncing', 1000);
        showQuickMessage(
            getNextMessage(excitedMessages, 'vibebuild_msg_idx_excited'),
            'excited', 2500
        );
        jealousyCooldown = true;
        setTimeout(() => { jealousyCooldown = false; }, 5000);
        return;
    }
    
    // Click on CTA buttons — appreciate
    const clickedBtn = e.target.closest('button, a');
    if (clickedBtn && !clickedBtn.closest('#vibes-gravity-logo-container')) {
        // 30% chance of jealousy
        if (Math.random() < 0.3) {
            showQuickMessage(
                getNextMessage(jealousMessages, 'vibebuild_msg_idx_jealous'),
                'jealous', 3000
            );
            spawnParticle('fire', 2);
            jealousyCooldown = true;
            setTimeout(() => { jealousyCooldown = false; }, 8000);
        }
    }
});

// --- RANDOM EVENT SCHEDULER ---
let randomEventInterval = null;

function scheduleRandomEvents() {
    randomEventInterval = setInterval(() => {
        if (currentSlide === 10 || isStuck || isDodging || idleStage > 1) return;
        
        const roll = Math.random();
        
        if (roll < 0.08) {
            // 8% — Peek-a-boo
            triggerAnimation('peeking', 1500);
            showQuickMessage("BOO! 🫣 Did I scare you?!", 'smirk', 2000);
        } else if (roll < 0.15) {
            // 7% — Victory spin
            triggerAnimation('spinning', 600);
            spawnParticle('sparkle', 3);
            showQuickMessage("WHEEEEE! 🌀✨", 'excited', 2000);
        } else if (roll < 0.22) {
            // 7% — Sassy comment
            showQuickMessage(
                getNextMessage(sassyMessages, 'vibebuild_msg_idx_sassy'),
                'sassy', 3500
            );
        } else if (roll < 0.28) {
            // 6% — Dodge trigger (only if close to cursor)
            const dx = lastCursorX - logoX;
            const dy = lastCursorY - logoY;
            const dist = Math.hypot(dx, dy);
            if (dist < 200) {
                triggerDodge();
            }
        } else if (roll < 0.34) {
            // 6% — Appreciation moment
            showQuickMessage(
                getNextMessage(appreciateMessages, 'vibebuild_msg_idx_appreciate'),
                'love', 4000
            );
            spawnParticle('heart', 3);
        } else if (roll < 0.38) {
            // 4% — Mini rage bait
            showQuickMessage(
                getNextMessage(rageBaitMessages, 'vibebuild_msg_idx_rage'),
                'angry', 3000
            );
            triggerAnimation('shaking', 1500);
            spawnParticle('fire', 2);
        } else if (roll < 0.42) {
            // 4% — Clingy moment
            showQuickMessage(
                getNextMessage(clingyMessages, 'vibebuild_msg_idx_clingy'),
                'clingy', 3500
            );
            triggerAnimation('wiggling', 2500);
        }
        // 58% — nothing happens, normal behavior
        
    }, 12000); // Check every 12 seconds
}

scheduleRandomEvents();

// --- SCROLL SPEED DETECTION (rage bait if scrolling too fast) ---
let lastScrollTop = 0;
let fastScrollCount = 0;

document.querySelectorAll('.lp-scrollable').forEach(scroller => {
    scroller.addEventListener('scroll', () => {
        if (currentSlide === 10) return;
        
        const scrollDelta = Math.abs(scroller.scrollTop - lastScrollTop);
        lastScrollTop = scroller.scrollTop;
        
        if (scrollDelta > 500) {
            fastScrollCount++;
            if (fastScrollCount >= 3) {
                const speedMsgs = [
                    "WOAH SLOW DOWN! I can't read that fast! 🫨",
                    "Are you speedrunning this?! Take your time! 😤",
                    "HEY! The content deserves RESPECT! 📖",
                    "My pixels are getting motion sick! 🤢"
                ];
                showQuickMessage(speedMsgs[Math.floor(Math.random() * speedMsgs.length)], 'angry', 3000);
                triggerAnimation('shaking', 1500);
                fastScrollCount = 0;
            }
        }
    });
});

// --- CURSOR PROXIMITY REACTIONS ---
let proximityCheckInterval = setInterval(() => {
    if (currentSlide === 10 || isStuck || isDodging || idleStage > 0) return;
    
    const dx = lastCursorX - logoX;
    const dy = lastCursorY - logoY;
    const dist = Math.hypot(dx, dy);
    
    // Very close — react
    if (dist < 40 && currentMood === 'normal') {
        const closeMsgs = [
            "So close! Are you trying to boop me? 😊",
            "Hey! Personal space! ...just kidding come closer 🥰",
            "Ooh are we about to have a moment?! ✨",
            "*blushes in pixel* 😳"
        ];
        showQuickMessage(closeMsgs[Math.floor(Math.random() * closeMsgs.length)], 'love', 2500);
        spawnParticle('heart', 2);
    }
}, 3000);

// ========================================================
// MASCOT INTERACTION ENGINE — Inter-Mascot Behaviors
// ========================================================

// --- STATE ---
let interactionState = 'idle'; // idle, fight, push, rescue, rope, celebrate
let activeFollowerId = null;   // 'main', 'x', or 'discord' (none follow cursor by default)
let ropeActive = false;
let ropeElements = [];         // DOM rope line elements
let formationMode = 'triangle'; // triangle, line, orbit, scatter
let interactionCooldown = false;
let pushedOffMascot = null;    // which mascot was pushed off screen
let groundCenter = window.innerWidth / 2;
let rescueState = 'none';      // none, waiting_user, self_rescuing
let rescueTimer = null;

// Helpers to set bubble text on X/Discord
function setXBubble(msg, moodClass) {
    const bubble = document.getElementById('vibes-x-bubble');
    if (!bubble) return;
    const text = bubble.querySelector('.bubble-text');
    if (text) text.textContent = msg;
    bubble.classList.remove('fight-bubble', 'rescue-bubble');
    if (moodClass) bubble.classList.add(moodClass);
}

function setDiscordBubble(msg, moodClass) {
    const bubble = document.getElementById('vibes-discord-bubble');
    if (!bubble) return;
    const text = bubble.querySelector('.bubble-text');
    if (text) text.textContent = msg;
    bubble.classList.remove('fight-bubble', 'rescue-bubble');
    if (moodClass) bubble.classList.add(moodClass);
}

function clearSideBubbleMoods() {
    const xB = document.getElementById('vibes-x-bubble');
    const dB = document.getElementById('vibes-discord-bubble');
    if (xB) xB.classList.remove('fight-bubble', 'rescue-bubble');
    if (dB) dB.classList.remove('fight-bubble', 'rescue-bubble');
}

// Spawn collision particles between two points
function spawnCollisionParticles(x, y, count) {
    const emojis = ['💥', '⚡', '💢', '✨', '🔥'];
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'collision-particle';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.setProperty('--cx', `${(Math.random() - 0.5) * 80}px`);
        el.style.setProperty('--cy', `${(Math.random() - 0.5) * 80}px`);
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 700);
    }
}

// --- BEHAVIOR 1: FIGHT MODE ---
function triggerMascotFight() {
    if (interactionState !== 'idle' || interactionCooldown || currentSlide === 10 || isStuck || activeFollowerId !== null) return;
    interactionState = 'fight';
    interactionCooldown = true;

    // Pick two fighters randomly
    const mascots = ['main', 'x', 'discord'];
    const i1 = Math.floor(Math.random() * 3);
    let i2 = (i1 + 1 + Math.floor(Math.random() * 2)) % 3;
    const fighter1 = mascots[i1];
    const fighter2 = mascots[i2];

    const getContainer = (id) => {
        if (id === 'main') return gravityContainer;
        if (id === 'x') return xMascotContainer;
        return discordMascotContainer;
    };

    // Midpoint of both fighters for collision point
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight - 100;

    // Fight messages
    const fightMsgs = {
        main: ["I'm the MAIN mascot! Back off! 😤⚔️", "You dare challenge ME?! 🔥", "I was here FIRST! 💪"],
        x: ["I have MORE followers! 𝕏💪", "Trending topics say I WIN! 📈", "Blue checkmark beats you! ✓😎"],
        discord: ["Community > Everything! 💬🔥", "My server has MORE members! 👥", "Voice chat THIS! 🎤💥"]
    };

    showQuickMessage(fightMsgs[fighter1][Math.floor(Math.random() * 3)], 'angry', 3500);
    setXBubble(fighter2 === 'x' ? fightMsgs.x[Math.floor(Math.random() * 3)] : "Oh no, a fight! 😱", 'fight-bubble');
    setDiscordBubble(fighter2 === 'discord' ? fightMsgs.discord[Math.floor(Math.random() * 3)] : "Oh no, a fight! 😱", 'fight-bubble');

    // Apply shake animations
    [fighter1, fighter2].forEach(f => {
        const c = getContainer(f);
        if (c) c.classList.add('fight-shaking');
    });

    // Collision particles after a delay
    setTimeout(() => {
        spawnCollisionParticles(midX, midY, 5);
    }, 600);

    // End fight after 3 seconds
    setTimeout(() => {
        [fighter1, fighter2].forEach(f => {
            const c = getContainer(f);
            if (c) c.classList.remove('fight-shaking');
        });

        // Loser gets dizzy
        const loser = Math.random() < 0.5 ? fighter1 : fighter2;
        const loserContainer = getContainer(loser);
        if (loserContainer) {
            loserContainer.classList.add('dizzy');
            const stars = document.createElement('div');
            stars.className = 'dizzy-stars';
            stars.textContent = '⭐🌟⭐';
            loserContainer.appendChild(stars);
            setTimeout(() => {
                loserContainer.classList.remove('dizzy');
                stars.remove();
            }, 2000);
        }

        const winnerMsgs = ["I WON! 🏆", "Too easy! 😎💪", "Don't mess with me! 🔥"];
        const loserMsgs = ["Oww... 🫨💫", "That was unfair... 😵", "I'll get you next time! 😤"];

        if (loser === 'main') {
            showQuickMessage(loserMsgs[Math.floor(Math.random() * 3)], 'shock', 2500);
        } else {
            showQuickMessage(winnerMsgs[Math.floor(Math.random() * 3)], 'excited', 2500);
        }

        clearSideBubbleMoods();
        interactionState = 'idle';
        setTimeout(() => { interactionCooldown = false; }, 8000);
    }, 3200);
}

// --- BEHAVIOR 2: PUSH / DHAKKA & RESCUE ---
function triggerMascotPush() {
    if (interactionState !== 'idle' || interactionCooldown || currentSlide === 10 || isStuck || activeFollowerId !== null) return;
    interactionState = 'push';
    interactionCooldown = true;

    // Pick victim randomly
    const mascots = ['main', 'x', 'discord'];
    const victimIdx = Math.floor(Math.random() * 3);
    const victim = mascots[victimIdx];
    const bullies = mascots.filter(m => m !== victim);

    const getContainer = (id) => {
        if (id === 'main') return gravityContainer;
        if (id === 'x') return xMascotContainer;
        return discordMascotContainer;
    };

    const victimContainer = getContainer(victim);
    if (!victimContainer) return;

    pushedOffMascot = victim;
    rescueState = 'waiting_user';

    // Bullies say something mean
    const bullyMsgs = ["BYE BYE! 😈💨", "Get OUTTA here! 🤣", "YEET! 🚀😂", "Don't come back! 😤"];
    bullies.forEach(b => {
        if (b === 'x') setXBubble(bullyMsgs[Math.floor(Math.random() * bullyMsgs.length)], 'fight-bubble');
        if (b === 'discord') setDiscordBubble(bullyMsgs[Math.floor(Math.random() * bullyMsgs.length)], 'fight-bubble');
        if (b === 'main') showQuickMessage(bullyMsgs[Math.floor(Math.random() * bullyMsgs.length)], 'sassy', 3000);
    });

    // Collision particles at victim
    const victimX = victim === 'main' ? logoX : (victim === 'x' ? xMascotX : discordMascotX);
    const victimY = victim === 'main' ? logoY : (victim === 'x' ? xMascotY : discordMascotY);
    spawnCollisionParticles(victimX + 20, victimY + 20, 4);

    // Push animation (launches off screen)
    victimContainer.classList.add('pushed-off');

    // Notify user to rescue
    setTimeout(() => {
        if (pushedOffMascot === victim && rescueState === 'waiting_user') {
            const helpMsg = "HELP! Bring them back! 🥺";
            const edgeMsg = "Hover cursor near the bottom edge! 🆘";
            bullies.forEach(b => {
                if (b === 'main') showQuickMessage(helpMsg, 'crying', 4000);
                if (b === 'x') setXBubble(edgeMsg, 'rescue-bubble');
                if (b === 'discord') setDiscordBubble(edgeMsg, 'rescue-bubble');
            });
        }
    }, 800);

    // Auto self-rescue after 4.5 seconds if user ignores
    if (rescueTimer) clearTimeout(rescueTimer);
    rescueTimer = setTimeout(() => {
        if (pushedOffMascot === victim && rescueState === 'waiting_user') {
            triggerSelfRescue();
        }
    }, 4500);
}

// User rescues mascot by hovering near bottom edge
function triggerRescueSuccess(byUser) {
    if (pushedOffMascot === null) return;
    if (rescueTimer) clearTimeout(rescueTimer);
    rescueState = 'none';

    const victim = pushedOffMascot;
    const getContainer = (id) => {
        if (id === 'main') return gravityContainer;
        if (id === 'x') return xMascotContainer;
        return discordMascotContainer;
    };

    const victimContainer = getContainer(victim);
    if (victimContainer) {
        victimContainer.classList.remove('pushed-off');
        victimContainer.classList.add('respawning');

        // Remove rescue ropes
        removeAllRopes();

        // Dialogue messages
        const successMsgs = byUser 
            ? ["Gotcha! Thank you! 💖", "Phew, saved! 🥺✨", "User is our hero! 🦸‍♂️🎉"]
            : ["Phew! Got them! 😮‍💨", "We did it ourselves! 💪", "Don't scare us! 😤"];
            
        if (victim === 'main') showQuickMessage(successMsgs[Math.floor(Math.random() * 3)], 'excited', 2500);
        else if (victim === 'x') setXBubble(successMsgs[Math.floor(Math.random() * 3)]);
        else if (victim === 'discord') setDiscordBubble(successMsgs[Math.floor(Math.random() * 3)]);

        // Celebrate
        const saviors = ['main', 'x', 'discord'].filter(m => m !== victim);
        saviors.forEach(s => {
            const container = getContainer(s);
            if (container) {
                container.classList.add('celebrating');
                setTimeout(() => container.classList.remove('celebrating'), 600);
            }
            if (s === 'main') showQuickMessage(byUser ? "Nice save! 🤩" : "Got the rope! 👍", 'happy', 2000);
            else if (s === 'x') setXBubble(byUser ? "Thanks user! 🕏" : "Heave! 🪢");
            else if (s === 'discord') setDiscordBubble(byUser ? "Hooray! 💬" : "Safety first! 💬");
        });

        setTimeout(() => {
            victimContainer.classList.remove('respawning');
            pushedOffMascot = null;
            interactionState = 'idle';
            clearSideBubbleMoods();
            setTimeout(() => { interactionCooldown = false; }, 8000);
        }, 1000);
    }
}

// Auto self rescue by throwing rope off-screen
function triggerSelfRescue() {
    if (pushedOffMascot === null) return;
    rescueState = 'self_rescuing';

    const victim = pushedOffMascot;
    const getContainer = (id) => {
        if (id === 'main') return gravityContainer;
        if (id === 'x') return xMascotContainer;
        return discordMascotContainer;
    };

    const victimContainer = getContainer(victim);
    const saviors = ['main', 'x', 'discord'].filter(m => m !== victim);

    saviors.forEach(s => {
        if (s === 'main') showQuickMessage("Fine, we'll do it ourselves! 😤🪢", 'angry', 2500);
        else if (s === 'x') setXBubble("Throwing rope! 🪢", 'rescue-bubble');
        else if (s === 'discord') setDiscordBubble("Pull! Heave ho! 🏋️🪢", 'rescue-bubble');
    });

    // Place coordinates off-screen for victim to align rope visual
    if (victim === 'main') {
        logoX = groundCenter;
        logoY = window.innerHeight + 150;
    } else if (victim === 'x') {
        xMascotX = groundCenter - 60;
        xMascotY = window.innerHeight + 150;
    } else if (victim === 'discord') {
        discordMascotX = groundCenter + 60;
        discordMascotY = window.innerHeight + 150;
    }

    saviors.forEach(s => {
        createRopeBetween(`self-rescue-${s}`, getContainer(s), victimContainer);
    });
    ropeActive = true;

    // Self pull back animation completes after 2.5 seconds
    setTimeout(() => {
        if (pushedOffMascot === victim && rescueState === 'self_rescuing') {
            triggerRescueSuccess(false);
        }
    }, 2500);
}

// --- BEHAVIOR 3: PAGE BOUNDARY RESCUE ---
const originalTriggerPageBoundaryStuck = triggerPageBoundaryStuck;
triggerPageBoundaryStuck = function(fromSlide, toSlide, direction) {
    originalTriggerPageBoundaryStuck(fromSlide, toSlide, direction);

    // After 3 seconds, X and Discord notice and try to rescue
    setTimeout(() => {
        if (!isStuck) return; 

        setXBubble("OH NO! They're stuck! 😱 PULL!", 'rescue-bubble');
        setDiscordBubble("We got you! HEAVE! 💪🪢", 'rescue-bubble');

        createRopeBetween('x-rescue', xMascotContainer, gravityContainer);
        createRopeBetween('discord-rescue', discordMascotContainer, gravityContainer);
        ropeActive = true;

        setTimeout(() => {
            if (isStuck && ropeElements.length > 0) {
                ropeElements.forEach(r => r.classList.add('straining'));
                setXBubble("PULL HARDER! 🏋️💦", 'rescue-bubble');
                setDiscordBubble("Almost... got... it! 😤💪", 'rescue-bubble');
            }
        }, 2000);
    }, 3000);
};

const originalBreakThroughWall = breakThroughWall;
breakThroughWall = function(direction) {
    removeAllRopes();
    clearSideBubbleMoods();
    setXBubble("We did it! 🎉");
    setDiscordBubble("FREEDOM! 🥳");
    originalBreakThroughWall(direction);
};

// --- ROPE RENDERING ---
function createRopeBetween(id, fromEl, toEl) {
    const rope = document.createElement('div');
    rope.className = 'mascot-rope';
    rope.id = `rope-${id}`;
    rope.dataset.from = fromEl ? fromEl.id : '';
    rope.dataset.to = toEl ? toEl.id : '';
    document.body.appendChild(rope);
    ropeElements.push(rope);
    return rope;
}

function updateRopePositions() {
    ropeElements.forEach(rope => {
        const fromEl = document.getElementById(rope.dataset.from);
        const toEl = document.getElementById(rope.dataset.to);
        if (!fromEl || !toEl) return;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        const x1 = fromRect.left + fromRect.width / 2;
        const y1 = fromRect.top + fromRect.height / 2;
        const x2 = toRect.left + toRect.width / 2;
        const y2 = toRect.top + toRect.height / 2;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        rope.style.left = `${x1}px`;
        rope.style.top = `${y1}px`;
        rope.style.width = `${length}px`;
        rope.style.transform = `rotate(${angle}deg)`;
    });
}

function removeAllRopes() {
    ropeElements.forEach(r => {
        r.classList.add('snapping');
        setTimeout(() => r.remove(), 300);
    });
    ropeElements = [];
    ropeActive = false;
}

// --- BEHAVIOR 4: HOVER FOLLOW CAPTURE SYSTEM ---
function setupRopeCapture() {
    // Double-click to cut rope
    document.addEventListener('dblclick', (e) => {
        if (!activeFollowerId || !ropeActive) return;
        
        // Spawn cut particles at click coordinates
        const cutEl = document.createElement('div');
        cutEl.className = 'rope-cut-particle';
        cutEl.textContent = '✂️💥';
        cutEl.style.left = `${e.clientX}px`;
        cutEl.style.top = `${e.clientY}px`;
        document.body.appendChild(cutEl);
        setTimeout(() => cutEl.remove(), 600);

        endRopeCapture();
    });
}

function startRopeCapture(mascotId) {
    if (interactionState !== 'idle') return;
    interactionState = 'rope';
    activeFollowerId = mascotId;
    ropeActive = true;

    const getContainer = (id) => {
        if (id === 'main') return gravityContainer;
        if (id === 'x') return xMascotContainer;
        return discordMascotContainer;
    };

    const others = ['main', 'x', 'discord'].filter(m => m !== mascotId);
    others.forEach(otherId => {
        createRopeBetween(`capture-${otherId}`, getContainer(otherId), getContainer(mascotId));
    });

    // Dialogue prompts on follow
    const followMsgs = {
        main: ["Wheee! I can see the whole website! 🌌", "Higher! 🎈", "Look at me float! 🤩"],
        x: ["Whoa! Higher than the clouds! 𝕏☁️", "Help, I'm being hijacked! 🕏😂", "Wheee! I'm viral now! 📈"],
        discord: ["I can see our server from here! 💬🌌", "Don't drop me! 🔔😱", "Floating in voice chat! 🚀"]
    };

    const jealousMsgs = [
        "Leave him alone! 😡",
        "Nooo! Don't kidnap them! 🚨",
        "Hey! Put him down, user! 😤",
        "Save him! 😭",
        "Stop dragging our buddy! 🥺🪢"
    ];

    if (mascotId === 'main') showQuickMessage(followMsgs.main[Math.floor(Math.random() * 3)], 'excited', 3000);
    else if (mascotId === 'x') setXBubble(followMsgs.x[Math.floor(Math.random() * 3)]);
    else if (mascotId === 'discord') setDiscordBubble(followMsgs.discord[Math.floor(Math.random() * 3)]);

    others.forEach(o => {
        const msg = jealousMsgs[Math.floor(Math.random() * jealousMsgs.length)];
        if (o === 'main') showQuickMessage(msg, 'jealous', 4000);
        if (o === 'x') setXBubble(msg, 'fight-bubble');
        if (o === 'discord') setDiscordBubble(msg, 'fight-bubble');
    });

    // Strain ropes after 3 seconds
    setTimeout(() => {
        if (activeFollowerId === mascotId) {
            ropeElements.forEach(r => r.classList.add('straining'));
            others.forEach(o => {
                if (o === 'x') setXBubble("PULL! We're losing them! 😤🪢");
                if (o === 'discord') setDiscordBubble("HEAVE HO! 💪💪");
                if (o === 'main') showQuickMessage("I won't let go! 😤🪢", 'angry', 3000);
            });
        }
    }, 3000);

    // Auto-release after 8 seconds if user doesn't cut
    setTimeout(() => {
        if (activeFollowerId === mascotId) {
            endRopeCapture();
        }
    }, 8000);
}

function endRopeCapture() {
    const freed = activeFollowerId;
    activeFollowerId = null;
    removeAllRopes();
    clearSideBubbleMoods();

    const freeMsgs = ["I'M FREE! 🎉", "Thanks for cutting the rope! ✂️✨", "LIBERTY! 🗽", "Never catch me again! 😤💨"];
    const msg = freeMsgs[Math.floor(Math.random() * freeMsgs.length)];
    if (freed === 'main') showQuickMessage(msg, 'excited', 2500);
    if (freed === 'x') setXBubble(msg);
    if (freed === 'discord') setDiscordBubble(msg);

    spawnParticle('sparkle', 3);
    interactionState = 'idle';
}

setupRopeCapture();

// --- BEHAVIOR 5: JEALOUSY CHAIN ---
let cursorNearMascotTimer = null;
let favoredMascot = null;

function checkJealousyChain() {
    if (interactionState !== 'idle' || interactionCooldown || currentSlide === 10 || isStuck || activeFollowerId !== null) return;

    // Check which mascot cursor is nearest to
    const dists = {
        main: Math.hypot(lastCursorX - logoX, lastCursorY - logoY),
        x: Math.hypot(lastCursorX - xMascotX, lastCursorY - xMascotY),
        discord: Math.hypot(lastCursorX - discordMascotX, lastCursorY - discordMascotY)
    };

    const closest = Object.entries(dists).sort((a, b) => a[1] - b[1])[0];
    if (closest[1] < 80 && closest[0] === favoredMascot) {
        return;
    }

    if (closest[1] < 80) {
        favoredMascot = closest[0];
        clearTimeout(cursorNearMascotTimer);
        cursorNearMascotTimer = setTimeout(() => {
            if (interactionState !== 'idle') return;

            // Trigger jealousy
            const bragMsgs = ["They like ME the most! 😎✨", "I'm clearly the favorite! 👑", "See? I'm #1! 🥇"];
            const jealousMsgs2 = ["What about US?! 😤", "This is SO unfair! 💔", "We're cooler! 😡"];

            if (favoredMascot === 'main') showQuickMessage(bragMsgs[Math.floor(Math.random() * 3)], 'sassy', 3000);
            if (favoredMascot === 'x') setXBubble(bragMsgs[Math.floor(Math.random() * 3)]);
            if (favoredMascot === 'discord') setDiscordBubble(bragMsgs[Math.floor(Math.random() * 3)]);

            ['main', 'x', 'discord'].filter(m => m !== favoredMascot).forEach(m => {
                const msg = jealousMsgs2[Math.floor(Math.random() * 3)];
                if (m === 'main') showQuickMessage(msg, 'jealous', 3000);
                if (m === 'x') setXBubble(msg, 'fight-bubble');
                if (m === 'discord') setDiscordBubble(msg, 'fight-bubble');
            });

            setTimeout(() => { clearSideBubbleMoods(); favoredMascot = null; }, 4000);
        }, 5000);
    } else {
        favoredMascot = null;
        clearTimeout(cursorNearMascotTimer);
    }
}

// --- BEHAVIOR 6: FORMATION MODES ---
function setFormation(mode) {
    formationMode = mode;
}

function getFormationTarget(mascotId) {
    // Returns {x, y} offset from main mascot based on formation
    const time = Date.now() / 1000;
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.6 : 1.0;

    switch (formationMode) {
        case 'line':
            if (mascotId === 'x') return { x: -80 * scale, y: 0 };
            if (mascotId === 'discord') return { x: 80 * scale, y: 0 };
            break;
        case 'orbit':
            if (mascotId === 'x') {
                return {
                    x: Math.cos(time * 1.5) * 90 * scale,
                    y: Math.sin(time * 1.5) * 90 * scale
                };
            }
            if (mascotId === 'discord') {
                return {
                    x: Math.cos(time * 1.5 + Math.PI) * 90 * scale,
                    y: Math.sin(time * 1.5 + Math.PI) * 90 * scale
                };
            }
            break;
        case 'scatter':
            if (mascotId === 'x') return { x: -150 * scale + Math.sin(time) * 20, y: -100 * scale + Math.cos(time) * 15 };
            if (mascotId === 'discord') return { x: 150 * scale + Math.cos(time) * 20, y: 100 * scale + Math.sin(time) * 15 };
            break;
        default: // triangle
            if (mascotId === 'x') return { x: -120 * scale, y: 10 * scale };
            if (mascotId === 'discord') return { x: 120 * scale, y: 10 * scale };
    }
    return { x: 0, y: 0 };
}

// --- BEHAVIOR 7: COOPERATIVE CELEBRATION ---
function triggerCoopCelebration() {
    if (interactionState !== 'idle' || currentSlide === 10) return;
    interactionState = 'celebrate';

    // All mascots jump and celebrate
    [gravityContainer, xMascotContainer, discordMascotContainer].forEach((c, i) => {
        if (!c) return;
        setTimeout(() => {
            c.classList.add('celebrating');
            setTimeout(() => c.classList.remove('celebrating'), 600);
        }, i * 200); // Stagger for wave effect
    });

    // Sequential messages
    showQuickMessage("GREAT RATING! 🎉⚔️", 'excited', 2000);
    setTimeout(() => setXBubble("Share it on X! 𝕏🐦"), 300);
    setTimeout(() => setDiscordBubble("Tell the community! 💬🎊"), 600);

    // Collision sparkles at center
    setTimeout(() => {
        const cx = (logoX + xMascotX + discordMascotX) / 3 + 30;
        const cy = (logoY + xMascotY + discordMascotY) / 3 + 30;
        spawnCollisionParticles(cx, cy, 6);
        spawnParticle('heart', 3);
    }, 800);

    setTimeout(() => {
        interactionState = 'idle';
    }, 3000);
}

// Hook celebration into star rating clicks
const originalStarClickHandler = document.querySelector('.star-btn');
document.addEventListener('click', (e) => {
    const star = e.target.closest('.star-btn');
    if (star && Math.random() < 0.4) { // 40% chance on rating
        setTimeout(triggerCoopCelebration, 500);
    }
});

// --- BEHAVIOR 8: ENHANCED GRAVITY FALL ---
// Modify the existing initializeInteractiveLogo to add collision bounce
const originalInitializeInteractiveLogo = initializeInteractiveLogo;
initializeInteractiveLogo = function() {
    originalInitializeInteractiveLogo();

    // After all three land, collision bounce
    setTimeout(() => {
        if (gravityContainer) gravityContainer.classList.add('landing-bounce');
        if (xMascotContainer) xMascotContainer.classList.add('landing-bounce');
        if (discordMascotContainer) discordMascotContainer.classList.add('landing-bounce');

        // Collision particles at landing point
        spawnCollisionParticles(logoX + 30, logoY + 20, 3);

        // Landing messages
        showQuickMessage("OOF! Rough landing! 💥⚔️", 'shock', 2000);
        setTimeout(() => setXBubble("Oww my pixels! 😵 Ready tho! 𝕏"), 300);
        setTimeout(() => setDiscordBubble("That hurt! 🤕 Let's go! 💬"), 500);

        setTimeout(() => {
            [gravityContainer, xMascotContainer, discordMascotContainer].forEach(c => {
                if (c) c.classList.remove('landing-bounce');
            });
            showQuickMessage("Okay team, let's go! ⚔️🔥", 'excited', 2000);
            setTimeout(() => setXBubble("Ready! 𝕏✨"), 200);
            setTimeout(() => setDiscordBubble("Ready! 💬✨"), 400);

            // Auto-open Creator Modal on Load
            setTimeout(() => {
                if (creatorModal && !hasReadCreatorMessage) {
                    creatorModal.classList.add('active');
                    hasReadCreatorMessage = true;
                    startBubbleRotation(postOpenMessages, 'vibebuild_msg_idx_post');
                }
            }, 700);
        }, 1500);
    }, 500); // After gravity fall ends
};

// --- UPDATED PHYSICS LOOP (formation + rope) ---
// Patch into the existing tickLogoPhysics for formation and rope rendering
const originalTickLogoPhysics = tickLogoPhysics;
// We can't easily replace the rAF function, so we add a separate updater
function tickInteractions() {
    // Update rope positions if active
    if (ropeActive && ropeElements.length > 0) {
        updateRopePositions();
    }

    // Check jealousy
    checkJealousyChain();

    requestAnimationFrame(tickInteractions);
}
requestAnimationFrame(tickInteractions);

// --- RANDOM INTERACTION SCHEDULER ---
let mascotInteractionInterval = setInterval(() => {
    if (interactionState !== 'idle' || interactionCooldown || currentSlide === 10 || isStuck || isDodging) return;

    const roll = Math.random();

    if (roll < 0.25) {
        // 25% — Fight
        triggerMascotFight();
    } else if (roll < 0.45) {
        // 20% — Push/Dhakka
        triggerMascotPush();
    } else if (roll < 0.60) {
        // 15% — Change formation
        const formations = ['triangle', 'line', 'orbit', 'scatter'];
        const current = formationMode;
        let next;
        do { next = formations[Math.floor(Math.random() * formations.length)]; } while (next === current);
        setFormation(next);

        const formMsgs = {
            triangle: "Triangle formation! ▲",
            line: "Line up! ➡️",
            orbit: "Orbit mode! 🌀",
            scatter: "SCATTER! 💨"
        };
        showQuickMessage(formMsgs[next], 'excited', 2000);
        setTimeout(() => setXBubble("Roger that! 𝕏"), 200);
        setTimeout(() => setDiscordBubble("Copy! 💬"), 400);

        // Return to triangle after 10 seconds
        setTimeout(() => {
            if (formationMode === next) setFormation('triangle');
        }, 10000);
    }
    // 40% — nothing, normal behavior

}, 12000); // Check every 12 seconds

console.log('🎮 Enhanced Mascot Behavior Engine loaded! The logo is now ALIVE!');
console.log('🤝 Mascot Interaction Engine loaded! 3 mascots now fight, push, rescue, and celebrate together!');
