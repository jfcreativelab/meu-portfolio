
// QUANTUMVERSE CORE SYSTEM
// High-Performance Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHoloCards();
    initGlitchEffect();
    initContactForm();
    initSkillTabs();
    initSkillsAnimation();
    initMobileMenu();
});

/* --- 1.1 MOBILE MENU --- */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* --- 1. CUSTOM CURSOR SYSTEM --- */
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    // Safe check if elements exist
    if (!dot || !outline) return;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly (Software Cursor)
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Outline follows with lag (Fluidity)
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Interactive Hover States
    const interactiveElements = document.querySelectorAll('a, button, .holo-card, input, textarea');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '60px';
            outline.style.height = '60px';
            outline.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
            outline.style.mixBlendMode = 'screen';
        });

        el.addEventListener('mouseleave', () => {
            outline.style.width = '40px';
            outline.style.height = '40px';
            outline.style.backgroundColor = 'transparent';
            outline.style.mixBlendMode = 'difference';
        });
    });
}

/* --- 2. HOLOGRAPHIC 3D TILT --- */
function initHoloCards() {
    const cards = document.querySelectorAll('.holo-card');

    cards.forEach(card => {
        // Performance optimization: Using requestAnimationFrame? 
        // For simple tilt, direct style update is usually fine but let's keep it optimized.

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to card center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Multipliers control the intensity of the tilt
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply 3D Transform
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;

            // Dynamic Border Glow based on mouse position
            card.style.borderColor = 'var(--neon-cyan)';
        });

        // Reset on leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = `
                perspective(1000px) 
                rotateX(0) 
                rotateY(0) 
                scale(1)
            `;
            card.style.borderColor = 'var(--glass-border)';
        });
    });
}

/* --- 3. GLITCH TEXT EFFECT --- */
function initGlitchEffect() {
    const glitchTexts = document.querySelectorAll('.cyber-glitch-text');

    glitchTexts.forEach(text => {
        const originalContent = text.getAttribute('data-text');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/';

        // Glitch on Hover
        text.addEventListener('mouseover', () => {
            let iteration = 0;
            const maxIterations = originalContent.length;

            const interval = setInterval(() => {
                text.innerText = originalContent
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalContent[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= maxIterations) {
                    clearInterval(interval);
                    text.innerText = originalContent; // Ensure clean end
                }

                iteration += 1 / 3; // Controls speed of resolution
            }, 30);
        });
    });
}

/* --- 4. FORM HANDLING (Preserved Logic) --- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        // Visual Feedback
        btn.innerText = 'TRANSMITTING...';
        btn.style.opacity = '0.7';

        // Simulate Network Request
        await new Promise(r => setTimeout(r, 2000));

        // Success State
        btn.innerText = 'DATA_SENT_SUCCESSFULLY';
        btn.style.borderColor = 'var(--neon-cyan)';
        btn.style.color = 'var(--neon-cyan)';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.borderColor = 'var(--neon-magenta)';
            btn.style.color = 'white';
            btn.style.opacity = '1';
            form.reset();
        }, 3000);
    });
}

/* --- 5. SKILL TABS & ANIMATION --- */
function initSkillTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const grids = document.querySelectorAll('.skills-grid');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state
            tabs.forEach(t => t.classList.remove('active'));
            grids.forEach(g => g.classList.remove('active'));

            // Set new active
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            document.querySelector(`.skills-grid[data-category="${category}"]`).classList.add('active');
        });
    });
}

/* --- 6. SKILL BARS ANIMATION --- */
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = `${width}%`;
            }
        });
    }, { threshold: 0.1 });

    skillBars.forEach(bar => observer.observe(bar));
}
