// Initialize Lucide Icons
lucide.createIcons();

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
    }, 3500);
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
        }, 4000);
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
        }, 4500);
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

// Stuck state behavior
function triggerStuckState() {
    if (currentSlide === 10) return; // Don't trigger on final crying slide
    
    isStuck = true;
    isTeasing = false;
    isLogoInteractive = false;
    
    stuckSide = Math.random() < 0.5 ? 'left' : 'right';
    
    // Position vertically on the screen (centered-ish, not offscreen)
    const stuckY = Math.random() * (window.innerHeight - 250) + 120;
    
    if (stuckSide === 'left') {
        targetX = 20;
    } else {
        targetX = window.innerWidth - 80;
    }
    targetY = stuckY;
    
    // Change speech bubble immediately and clear rotation interval
    if (bubbleInterval) clearInterval(bubbleInterval);
    const bubbleElement = document.getElementById('vibes-gravity-bubble');
    const bubbleText = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;
    if (bubbleText) {
        const nextMsg = getNextMessage(stuckMessages, 'vibebuild_msg_idx_stuck');
        bubbleText.textContent = nextMsg;
    }
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

    // Slide 10 (Review Page) specific logo interaction & crying effect
    if (currentSlide === 10) {
        isLogoInteractive = false;
        isStuck = false; // Reset if stuck
        isTeasing = false;
        targetX = 20;
        targetY = 20;
        startCrying();
        startBubbleRotation(cryingMessages, 'vibebuild_msg_idx_cry');
    } else {
        stopCrying();
        
        // Stuck State Trigger Chance: 35% chance when changing pages
        if (Math.random() < 0.35) {
            triggerStuckState();
        } else {
            isStuck = false;
            isTeasing = false;
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

// 3. Nebula Double-Blind Rating Sliders (Slide 5)
const ratingInputs = document.querySelectorAll('.rating-input');
const calcFinalScore = document.getElementById('calc-final-score');

function calculateRating() {
    let finalScore = 0;
    
    ratingInputs.forEach(input => {
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

    if (calcFinalScore) {
        calcFinalScore.textContent = `${finalScore.toFixed(2)} / 10`;
    }
}

ratingInputs.forEach(input => {
    input.addEventListener('input', calculateRating);
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
calculateRating();

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
    xMascotX = logoX - 70;
    xMascotY = logoY + 10;
    discordMascotX = logoX + 70;
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
        const isModalActive = creatorModal && creatorModal.classList.contains('active');
        
        // Escape check for stuck logo
        if (isStuck && !isTeasing) {
            const dx = lastCursorX - logoX;
            const dy = lastCursorY - logoY;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 150) {
                isTeasing = true;
                
                // Jump to the opposite side
                if (stuckSide === 'left') {
                    stuckSide = 'right';
                    targetX = window.innerWidth - 80;
                } else {
                    stuckSide = 'left';
                    targetX = 20;
                }
                
                // Randomize Y slightly to feel playful
                targetY = Math.max(120, Math.min(window.innerHeight - 150, targetY + (Math.random() * 120 - 60)));
                
                // Set dialogue to tease
                const bubbleElement = document.getElementById('vibes-gravity-bubble');
                const bubbleText = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;
                if (bubbleText) {
                    const randomTease = getNextMessage(teasingMessages, 'vibebuild_msg_idx_tease');
                    bubbleText.textContent = randomTease;
                }
                
                // Wait for escape slide animation to complete, then return to normal follow
                setTimeout(() => {
                    isStuck = false;
                    isTeasing = false;
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

        if (isLogoInteractive) {
            if (isHovered || isModalActive) {
                targetX = logoX;
                targetY = logoY;
            }
            // Interpolate current position to target (smooth lag follow)
            logoX += (targetX - logoX) * 0.08;
            logoY += (targetY - logoY) * 0.08;
            
            // Boundaries restriction
            const size = 60;
            logoX = Math.max(10, Math.min(window.innerWidth - size - 10, logoX));
            logoY = Math.max(10, Math.min(window.innerHeight - size - 10, logoY));
        } else {
            // Non-interactive flight (Slide 10 flight, falling, or stuck slide)
            logoX += (targetX - logoX) * 0.08;
            logoY += (targetY - logoY) * 0.08;
        }
        
        gravityContainer.style.left = `${logoX}px`;
        gravityContainer.style.top = `${logoY}px`;
        
        // X Mascot Physics
        if (xMascotContainer) {
            const xTargetX = isXHovered ? xMascotX : logoX - 70;
            const xTargetY = isXHovered ? xMascotY : logoY + 10;
            xMascotX += (xTargetX - xMascotX) * 0.06;
            xMascotY += (xTargetY - xMascotY) * 0.06;

            const size = 60;
            xMascotX = Math.max(10, Math.min(window.innerWidth - size - 10, xMascotX));
            xMascotY = Math.max(10, Math.min(window.innerHeight - size - 10, xMascotY));

            xMascotContainer.style.left = `${xMascotX}px`;
            xMascotContainer.style.top = `${xMascotY}px`;
        }

        // Discord Mascot Physics
        if (discordMascotContainer) {
            const discordTargetX = isDiscordHovered ? discordMascotX : logoX + 70;
            const discordTargetY = isDiscordHovered ? discordMascotY : logoY + 10;
            discordMascotX += (discordTargetX - discordMascotX) * 0.06;
            discordMascotY += (discordTargetY - discordMascotY) * 0.06;

            const size = 60;
            discordMascotX = Math.max(10, Math.min(window.innerWidth - size - 10, discordMascotX));
            discordMascotY = Math.max(10, Math.min(window.innerHeight - size - 10, discordMascotY));

            discordMascotContainer.style.left = `${discordMascotX}px`;
            discordMascotContainer.style.top = `${discordMascotY}px`;
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
            showQuickMessage(
                getNextMessage(clingyMessages, 'vibebuild_msg_idx_clingy'),
                'clingy', 4000
            );
            triggerAnimation('wiggling', 3000);
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

console.log('🎮 Enhanced Mascot Behavior Engine loaded! The logo is now ALIVE!');
