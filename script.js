// ==========================
// BUTTONS AND MESSAGES
// ==========================

const yesSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
const noBtn = document.getElementById("noBtn");
const messages = [
    "Are you sure? 😢",
    "Really sure?? 🥺",
    "Think again 😭",
    "Werey ❤️",
    "Last chance 😳",
    "You can't say no 😤"
];
let messageIndex = 0;
let hoverCount = 0;
let originalPosition = null;

// Store original position when page loads
if (noBtn) {
    // Wait for layout to settle before storing position
    setTimeout(() => {
        const rect = noBtn.getBoundingClientRect();
        originalPosition = {
            left: rect.left,
            top: rect.top
        };
    }, 100);
}

// Optional click sound - using Web Audio API
function playNoSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Sad "aww" sound effect
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch(e) {
        console.log('Audio not supported');
    }
} 

// Unlock hover audio after first click
let audioUnlocked = false;
document.body.addEventListener("click", () => {
    audioUnlocked = true;
}, { once: true });

// ==========================
// NO BUTTON HOVER
// ==========================
if (noBtn) {
    noBtn.addEventListener("mouseenter", () => {
        // Increment hover count
        hoverCount++;
        
        // If user has tried 5 times, return button to original position
        if (hoverCount > 5) {
            noBtn.classList.remove('flying');
            noBtn.style.left = '';
            noBtn.style.top = '';
            noBtn.innerText = "Fine, you win! 💕";
            // Prevent further movement
            return;
        }
        
        // Play boing sound using Web Audio API
        if (audioUnlocked) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Bouncy boing effect: quick frequency drop with bounce
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.08);
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.09);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.12);
                
                // Volume envelope with punch
                gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                
                oscillator.type = 'sine';
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
            } catch(e) {
                console.log('Audio not supported');
            }
        }

        // Add flying class to switch to fixed positioning
        noBtn.classList.add('flying');
        
        // Get button dimensions AFTER adding flying class
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        // Calculate safe boundaries to keep button fully visible
        const margin = 50; // Increased margin for better visibility
        const minX = margin;
        const minY = margin;
        const maxX = window.innerWidth - btnWidth - margin;
        const maxY = window.innerHeight - btnHeight - margin;
        
        // Generate random position within safe boundaries
        const newX = Math.floor(Math.random() * (maxX - minX) + minX);
        const newY = Math.floor(Math.random() * (maxY - minY) + minY);
        
        // Apply new position
        noBtn.style.left = newX + "px";
        noBtn.style.top = newY + "px";

        // Change text
        noBtn.innerText = messages[messageIndex % messages.length];
        messageIndex++;
    });

    // ==========================
    // NO BUTTON CLICK
    // ==========================
    noBtn.addEventListener("click", () => {
        playNoSound();
    });
}



// ==========================
// YES BUTTON CLICK
// ==========================
const yesBtn = document.querySelector(".yes-btn");
if (yesBtn) {
    yesBtn.addEventListener("click", () => {
        // Play YES sound
        yesSound.currentTime = 0;
        yesSound.play().catch(e => console.log('Audio play failed:', e));

        // Extra hearts celebration
        for (let i = 0; i < 30; i++) {
            createHeart();
        }
    });
}


// ==========================
// HEARTS ANIMATION - OPTIMIZED
// ==========================
const heartsContainer = document.querySelector(".hearts");
const emojis = ["❤️", "💖", "💘", "💕", "💓"];

// Pre-create sway animations to avoid dynamic injection
const swayAnimations = [];
if (document.styleSheets[0]) {
    for (let i = 0; i < 10; i++) {
        const rotation = Math.random() * 360;
        const sway = Math.random() * 50 + 20;
        const swayAnimName = `sway${i}`;
        try {
            document.styleSheets[0].insertRule(`
                @keyframes ${swayAnimName} {
                    0% { transform: translateX(0px) rotate(${rotation}deg); }
                    50% { transform: translateX(${sway}px) rotate(${rotation + 15}deg); }
                    100% { transform: translateX(0px) rotate(${rotation - 15}deg); }
                }
            `, document.styleSheets[0].cssRules.length);
            swayAnimations.push(swayAnimName);
        } catch(e) {
            // Fallback
        }
    }
}

function createHeart() {
    if (!heartsContainer) return; // Safety check
    
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    // Random position & size
    const startX = Math.random() * 100; // vw
    heart.style.left = startX + "vw";
    const size = Math.random() * 20 + 15;
    heart.style.fontSize = size + "px";

    // Random animation duration
    const duration = Math.random() * 3 + 4; // 4-7s
    heart.style.animationDuration = duration + "s";

    // Random color and glow
    const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    heart.style.color = color;
    heart.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`;

    // Use pre-created animations
    if (swayAnimations.length > 0) {
        const randomSway = swayAnimations[Math.floor(Math.random() * swayAnimations.length)];
        heart.style.animationName = `${randomSway}, floatUp`;
        heart.style.animationTimingFunction = "linear, ease-in-out";
        heart.style.animationIterationCount = "1, infinite";
        heart.style.animationFillMode = "forwards, forwards";
    } else {
        heart.style.animationName = "floatUp";
    }

    heartsContainer.appendChild(heart);

    // Remove after animation
    setTimeout(() => heart.remove(), duration * 1000);
}

// Continuous floating hearts - REDUCED FREQUENCY
if (heartsContainer) {
    setInterval(createHeart, 400); // Changed from 150ms to 400ms
}

// ==========================
// MOUSE TRAIL HEARTS - THROTTLED
// ==========================
let lastTrailTime = 0;
const TRAIL_THROTTLE = 100; // Only create trail heart every 100ms

document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTrailTime < TRAIL_THROTTLE) {
        return; // Skip if too soon
    }
    lastTrailTime = now;

    const trailHeart = document.createElement("div");
    trailHeart.classList.add("heart");
    trailHeart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    trailHeart.style.left = e.clientX + "px";
    trailHeart.style.top = e.clientY + "px";
    trailHeart.style.fontSize = Math.random() * 15 + 10 + "px";
    trailHeart.style.position = "fixed"; // Changed to fixed for better performance
    trailHeart.style.pointerEvents = "none";
    trailHeart.style.opacity = 0.8;
    trailHeart.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
    trailHeart.style.zIndex = "1";

    document.body.appendChild(trailHeart);

    requestAnimationFrame(() => {
        trailHeart.style.transform = `translateY(-50px) scale(1.5) rotate(${Math.random() * 360}deg)`;
        trailHeart.style.opacity = 0;
    });

    setTimeout(() => trailHeart.remove(), 800);
});