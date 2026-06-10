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

// --- LOGO STATE, DIALOGUES & CRYING CONFIG ---
const preOpenMessages = [
    "Hello Vibe Coder! 👋",
    "I have a message for you! 🥺",
    "Please click me! 👉👈",
    "Can you open this? 🌸",
    "I made some mistakes... read here! 💔",
    "Hey! Check this out! ✨",
    "Please hear me out... 🥺"
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
    "Vibe build forever! ⚔️"
];

const cryingMessages = [
    "I don't want to let you go! 🥺😭",
    "Please stay! 💔",
    "Did you like the designs? 🌸",
    "Don't leave me... 🥺"
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
let cryingInterval = null;

// Touch device detection to bypass hover freeze on screens
window.addEventListener('touchstart', function onTouchStart() {
    isTouchDevice = true;
    window.removeEventListener('touchstart', onTouchStart);
}, { passive: true });

// Function to start speech bubble message rotation
function startBubbleRotation(messagesArray) {
    if (bubbleInterval) clearInterval(bubbleInterval);
    const bubbleElement = document.getElementById('vibes-gravity-bubble');
    const bubbleText = bubbleElement ? bubbleElement.querySelector('.bubble-text') : null;
    if (!bubbleText) return;
    
    currentMessageIdx = 0;
    bubbleText.textContent = messagesArray[currentMessageIdx];
    
    bubbleInterval = setInterval(() => {
        currentMessageIdx = (currentMessageIdx + 1) % messagesArray.length;
        bubbleText.textContent = messagesArray[currentMessageIdx];
    }, 3500);
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
        targetX = 20;
        targetY = 20;
        startCrying();
        startBubbleRotation(cryingMessages);
    } else {
        stopCrying();
        // Only return to follow mode if it's no longer falling
        if (gravityContainer && !gravityContainer.classList.contains('falling')) {
            isLogoInteractive = true;
        }
        if (hasReadCreatorMessage) {
            startBubbleRotation(postOpenMessages);
        } else {
            startBubbleRotation(preOpenMessages);
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
// EMAIL CAPTURE MODAL (Fix 2)
// ========================================================
const emailModal = document.getElementById('email-capture-modal');
const emailForm = document.getElementById('email-capture-form');
const emailInput = document.getElementById('email-capture-input');
const emailSkipBtn = document.getElementById('email-skip-btn');

if (emailModal) {
    // Show modal only if user hasn't submitted email yet
    const savedEmail = localStorage.getItem('vibebuild_user_email');
    if (!savedEmail) {
        // Show modal after a short delay for better UX
        setTimeout(() => {
            emailModal.classList.add('visible');
        }, 1500);
    }

    // Handle email submit
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (email) {
                localStorage.setItem('vibebuild_user_email', email);
                emailModal.classList.remove('visible');
                // Sync email with existing ratings
                syncRatingsToDatabase();
            }
        });
    }

    // Handle skip
    if (emailSkipBtn) {
        emailSkipBtn.addEventListener('click', () => {
            localStorage.setItem('vibebuild_user_email', 'skipped');
            emailModal.classList.remove('visible');
        });
    }
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
        // Check if user has provided email
        const email = localStorage.getItem('vibebuild_user_email');
        if (!email || email === 'skipped') {
            // Show email modal first
            if (emailModal) {
                emailModal.classList.add('visible');
            }
        } else {
            // Open Discord
            window.open(DISCORD_LINK, '_blank');
        }
    });
});

// Nav CTA links
const navCtaLinks = document.querySelectorAll('.lp-btn-primary, .lp-btn-cta, .lp-btn-solid');
navCtaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = localStorage.getItem('vibebuild_user_email');
        if (!email || email === 'skipped') {
            if (emailModal) emailModal.classList.add('visible');
        } else {
            window.open(DISCORD_LINK, '_blank');
        }
    });
});

// ========================================================
// FLOATING GRAVITY LOGO & CREATOR MODAL INTERACTIVITY
// ========================================================
const gravityContainer = document.getElementById('vibes-gravity-logo-container');
const gravityLogo = document.getElementById('vibes-gravity-logo');
const creatorModal = document.getElementById('vibes-creator-modal');
const modalClose = document.getElementById('vibes-creator-modal-close');
const modalThanks = document.getElementById('vibes-creator-modal-thanks');

// Initialize Lucide Icons for injected modal buttons
lucide.createIcons();

// Helper to transition the logo to interactive mode
function initializeInteractiveLogo() {
    if (!gravityContainer || !gravityContainer.classList.contains('falling')) return;
    
    gravityContainer.classList.remove('falling');
    // Position it at the bottom left initially
    logoX = window.innerWidth * 0.05;
    logoY = window.innerHeight - 80;
    
    if (currentSlide === 10) {
        targetX = 20;
        targetY = 20;
        isLogoInteractive = false;
        startCrying();
        startBubbleRotation(cryingMessages);
    } else {
        targetX = logoX;
        targetY = logoY;
        isLogoInteractive = true;
        if (hasReadCreatorMessage) {
            startBubbleRotation(postOpenMessages);
        } else {
            startBubbleRotation(preOpenMessages);
        }
    }
    gravityContainer.style.left = `${logoX}px`;
    gravityContainer.style.top = `${logoY}px`;
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
                startBubbleRotation(postOpenMessages);
            }
        }
    });
}

// Handle mouse movement for physics spring follow
document.addEventListener('mousemove', (e) => {
    const isModalActive = creatorModal && creatorModal.classList.contains('active');
    if (isLogoInteractive && !isHovered && !isModalActive) {
        // Offset the target coordinates so the logo sits next to the cursor instead of directly under it
        targetX = e.clientX + 20;
        targetY = e.clientY + 20;
    }
});

// Handle touch movement for mobile devices
document.addEventListener('touchmove', (e) => {
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
            // Non-interactive flight home (Slide 10 flight)
            logoX += (targetX - logoX) * 0.08;
            logoY += (targetY - logoY) * 0.08;
        }
        
        gravityContainer.style.left = `${logoX}px`;
        gravityContainer.style.top = `${logoY}px`;
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
            startBubbleRotation(postOpenMessages);
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
    startBubbleRotation(cryingMessages);
} else {
    // Start standard cute request bubble rotation
    startBubbleRotation(preOpenMessages);
}

