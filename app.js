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
        });
    });
});

// Slide 10 Feedback Form Submission
const btnSubmitFeedback = document.getElementById('btn-submit-feedback');
if (btnSubmitFeedback) {
    btnSubmitFeedback.addEventListener('click', () => {
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
