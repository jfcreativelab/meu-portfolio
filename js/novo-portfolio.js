// Portfolio JavaScript - Versão Moderna
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoading();
        this.setupMatrixEffect();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupContactForm();
        this.setupSkills();
        this.setupParallax();
        this.setupIntersectionObserver();
        this.setupModal();
    }

    // Matrix Effect
    setupMatrixEffect() {
        console.log('Iniciando efeito Matrix...');
        const matrixBg = document.getElementById('matrix-bg');
        if (!matrixBg) {
            console.error('Elemento matrix-bg não encontrado!');
            return;
        }

        console.log('Elemento matrix-bg encontrado!');
        const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const columns = Math.floor(window.innerWidth / 30);
        
        function createMatrixColumn() {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * (window.innerWidth - 20) + 'px';
            column.style.animationDuration = (Math.random() * 3 + 2) + 's';
            column.style.animationDelay = Math.random() * 2 + 's';
            
            // Criar caracteres aleatórios
            const charCount = Math.floor(Math.random() * 15) + 8;
            for (let i = 0; i < charCount; i++) {
                const char = document.createElement('span');
                char.className = 'matrix-character';
                char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                char.style.animationDelay = Math.random() * 2 + 's';
                column.appendChild(char);
            }
            
            matrixBg.appendChild(column);
            
            // Remover coluna após animação
            setTimeout(() => {
                if (column && column.parentNode) {
                    column.remove();
                }
            }, 6000);
        }
        
        // Limpar qualquer conteúdo anterior
        matrixBg.innerHTML = '';
        
        // Criar colunas inicialmente
        for (let i = 0; i < columns; i++) {
            setTimeout(() => {
                createMatrixColumn();
            }, i * 150);
        }
        
        // Continuar criando colunas
        const matrixInterval = setInterval(createMatrixColumn, 300);
        
        // Armazenar interval para poder limpar depois
        this.matrixInterval = matrixInterval;
        
        console.log(`Matrix iniciado com ${columns} colunas`);
    }

    // Loading Screen
    setupLoading() {
        const loadingScreen = document.querySelector('.loading-screen');
        const progressBar = document.querySelector('.progress-bar');
        
        // Simular carregamento
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 300);
            }
            progressBar.style.width = progress + '%';
        }, 100);
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        // Smooth scroll para links de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Toggle menu mobile
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Fechar menu ao clicar em link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar scroll effect
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            }

            // Hide/show navbar
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // Animations
    setupAnimations() {
        // Hero title animation
        this.animateHeroTitle();
        
        // Counter animation
        this.animateCounters();
        
        // Skill bars animation
        this.animateSkillBars();
        
        // Work items animation
        this.animateWorkItems();
    }

    animateHeroTitle() {
        const titleWords = document.querySelectorAll('.title-word');
        
        titleWords.forEach((word, index) => {
            setTimeout(() => {
                word.style.animation = `slideInUp 0.8s ease forwards`;
            }, index * 200);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 500);
        });
    }

    animateWorkItems() {
        const workItems = document.querySelectorAll('.work-item');
        
        workItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let message = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    message = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    message = 'E-mail inválido';
                }
                break;
            case 'subject':
                if (!value) {
                    isValid = false;
                    message = 'Selecione um assunto';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    message = 'Mensagem deve ter pelo menos 10 caracteres';
                }
                break;
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.style.borderColor = 'var(--border-primary)';
            if (errorElement) errorElement.remove();
        } else {
            field.style.borderColor = 'var(--error)';
            if (!errorElement) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = 'var(--error)';
                errorDiv.style.fontSize = 'var(--font-size-sm)';
                errorDiv.style.marginTop = 'var(--space-1)';
                field.parentNode.appendChild(errorDiv);
            }
            field.parentNode.querySelector('.error-message').textContent = message;
        }
    }

    handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Mensagem enviada com sucesso!', 'success');
            form.reset();
            submitBtn.disabled = false;
            btnText.textContent = 'Enviar Mensagem';
        }, 2000);
    }

    // Skills Tabs
    setupSkills() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const skillGrids = document.querySelectorAll('.skills-grid');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Remove active class from all tabs and grids
                tabBtns.forEach(b => b.classList.remove('active'));
                skillGrids.forEach(g => g.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding grid
                btn.classList.add('active');
                document.querySelector(`.skills-grid[data-category="${category}"]`).classList.add('active');
                
                // Animate skill bars
                setTimeout(() => {
                    this.animateSkillBars();
                }, 100);
            });
        });
    }

    // Parallax Effects
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Intersection Observer
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations based on section
                    if (entry.target.id === 'about') {
                        this.animateAboutSection();
                    } else if (entry.target.id === 'skills') {
                        this.animateSkillBars();
                    } else if (entry.target.id === 'work') {
                        this.animateWorkItems();
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    animateAboutSection() {
        const highlightItems = document.querySelectorAll('.highlight-item');
        const gridItems = document.querySelectorAll('.grid-item');
        
        highlightItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        gridItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            info: 'var(--primary)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    // Modal System
    setupModal() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.project-modal');
        
        // Abrir modal
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(`${modalId}-modal`);
                
                if (modal) {
                    this.openModal(modal);
                }
            });
        });
        
        // Fechar modal - botão de fechar
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.project-modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Fechar modal - clicando no overlay
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                const modal = overlay.closest('.project-modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        this.closeModal(modal);
                    }
                });
            }
        });
    }

    openModal(modal) {
        if (!modal) return;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        // Adicionar classe active
        modal.classList.add('active');
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    closeModal(modal) {
        if (!modal) return;
        
        // Remover classe active
        modal.classList.remove('active');
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        // Animar saída
        modal.style.opacity = '0';
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize Portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Additional utility functions
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Load non-critical resources here
        console.log('Portfolio loaded successfully!');
    });
} else {
    setTimeout(() => {
        console.log('Portfolio loaded successfully!');
    }, 1);
}
