
// QUANTUMVERSE CORE SYSTEM
// High-Performance Interactive Logic

// Page Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHoloCards();
    initGlitchEffect();
    initContactForm();
    initSkillTabs();
    initSkillsAnimation();
    initMobileMenu();
    initScrollProgress();
    initFormValidation();
    initAnalyticsTracking();
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

/* --- 4. FORM HANDLING (Formspree Integration) --- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const btnSpan = btn.querySelector('span');
        const originalText = btnSpan.innerText;

        // Visual Feedback
        btnSpan.innerText = 'ENVIANDO...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Sucesso
                btnSpan.innerText = 'MENSAGEM ENVIADA! ✓';
                btn.style.background = 'var(--toxic-lime)';
                form.reset();

                // Rastrear no Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        form_name: 'contact',
                        event_category: 'engagement',
                        event_label: 'Contact Form'
                    });
                }
            } else {
                throw new Error('Erro ao enviar');
            }
        } catch (error) {
            btnSpan.innerText = 'ERRO! Tente novamente';
            btn.style.background = 'red';
        }

        // Reset depois de 3s
        setTimeout(() => {
            btnSpan.innerText = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '';
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

            // Track skill category view
            if (typeof gtag !== 'undefined') {
                gtag('event', 'skill_category_view', {
                    category: category,
                    event_category: 'engagement'
                });
            }
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

/* --- 7. SCROLL PROGRESS BAR --- */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* --- 8. FORM VALIDATION --- */
function initFormValidation() {
    const formInputs = document.querySelectorAll('#contact-form input:not([type="submit"]), #contact-form textarea');

    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.style.borderBottomColor = 'red';
                input.setAttribute('aria-invalid', 'true');
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                input.style.borderBottomColor = 'red';
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.style.borderBottomColor = 'var(--toxic-lime)';
                input.setAttribute('aria-invalid', 'false');
            }
        });

        input.addEventListener('focus', () => {
            input.style.borderBottomColor = 'var(--toxic-lime)';
        });
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* --- 9. ANALYTICS TRACKING --- */
function initAnalyticsTracking() {
    // Track project clicks
    const projectLinks = document.querySelectorAll('.holo-card a');
    projectLinks.forEach(link => {
        link.addEventListener('click', () => {
            const projectTitle = link.closest('.holo-card').querySelector('.holo-title')?.textContent || 'Unknown';
            const linkType = link.classList.contains('secondary') ? 'GitHub' : 'Live Site';

            if (typeof gtag !== 'undefined') {
                gtag('event', 'project_click', {
                    project_name: projectTitle,
                    link_type: linkType,
                    event_category: 'engagement'
                });
            }
        });
    });

    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('.hero-actions .cyber-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const buttonText = btn.textContent.trim();

            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    button_text: buttonText,
                    location: 'hero',
                    event_category: 'engagement'
                });
            }
        });
    });

    // Track section views
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        section_name: sectionId,
                        event_category: 'engagement'
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));
}
