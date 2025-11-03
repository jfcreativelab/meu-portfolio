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

    // Matrix Effect - Otimizado para Performance
    setupMatrixEffect() {
        // Detectar se é mobile e reduzir/desabilitar Matrix
        const isMobile = window.innerWidth <= 768;
        const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                              (navigator.deviceMemory && navigator.deviceMemory <= 4);
        
        // Desabilitar Matrix em dispositivos móveis de baixa performance
        if (isMobile && isLowEndDevice) {
            const matrixBg = document.getElementById('matrix-bg');
            if (matrixBg) {
                matrixBg.style.display = 'none';
            }
            return;
        }
        
        const matrixBg = document.getElementById('matrix-bg');
        if (!matrixBg) {
            return;
        }

        const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
        // Reduzir drasticamente colunas no mobile
        const columns = isMobile ? Math.floor(window.innerWidth / 60) : Math.floor(window.innerWidth / 30);
        
        let activeColumns = 0;
        const maxActiveColumns = isMobile ? 5 : 15;
        
        function createMatrixColumn() {
            // Limitar colunas ativas simultaneamente
            if (activeColumns >= maxActiveColumns) {
                return;
            }
            
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = Math.random() * (window.innerWidth - 20) + 'px';
            column.style.animationDuration = (Math.random() * 3 + 2) + 's';
            column.style.willChange = 'transform';
            
            // Reduzir caracteres no mobile
            const charCount = isMobile ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 15) + 8;
            for (let i = 0; i < charCount; i++) {
                const char = document.createElement('span');
                char.className = 'matrix-character';
                char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                column.appendChild(char);
            }
            
            matrixBg.appendChild(column);
            activeColumns++;
            
            // Remover coluna após animação
            setTimeout(() => {
                if (column && column.parentNode) {
                    column.remove();
                    activeColumns--;
                }
            }, 6000);
        }
        
        // Limpar qualquer conteúdo anterior
        matrixBg.innerHTML = '';
        
        // Criar menos colunas inicialmente no mobile
        const initialColumns = isMobile ? Math.min(3, columns) : columns;
        for (let i = 0; i < initialColumns; i++) {
            setTimeout(() => {
                createMatrixColumn();
            }, i * 200);
        }
        
        // Intervalo maior no mobile
        const intervalTime = isMobile ? 800 : 300;
        const matrixInterval = setInterval(createMatrixColumn, intervalTime);
        
        // Armazenar interval para poder limpar depois
        this.matrixInterval = matrixInterval;
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
        
        if (!navToggle || !navMenu) {
            return; // Navigation elements not found
        }

        // Smooth scroll para links de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Ajustar offset baseado no tamanho da tela (mobile = 70px, desktop = 80px)
                    const isMobile = window.innerWidth <= 768;
                    const offset = isMobile ? 70 : 80;
                    const offsetTop = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Toggle menu mobile
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Atualizar ARIA
            navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            
            // Prevenir scroll do body quando menu está aberto
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
            
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            // Não interferir com links externos
            if (e.target.closest('a[data-external-link]') || e.target.closest('a[href^="http"]')) {
                return;
            }
            
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
            
        // Fechar menu ao fazer scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (navMenu.classList.contains('active')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }, 100);
            }
        }, { passive: true });

        // Fechar menu ao clicar em link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) {
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                if (navToggle) {
                    navToggle.classList.remove('active');
                }
            });
        });
    }

    // Scroll Effects - Otimizado com requestAnimationFrame
    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollY = window.scrollY;
        let ticking = false;
        const isMobile = window.innerWidth <= 768;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Navbar scroll effect - apenas em desktop
            if (!isMobile && currentScrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            } else if (!isMobile) {
                navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            }
            
            // Hide/show navbar on scroll - desabilitado no mobile
            if (!isMobile && currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else if (!isMobile) {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        // Usar requestAnimationFrame para melhor performance
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
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
        const errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        // Remover estado de erro anterior
        field.setAttribute('aria-invalid', isValid ? 'false' : 'true');
        
        if (isValid) {
            field.style.borderColor = 'var(--border-primary)';
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        } else {
            field.style.borderColor = 'var(--error)';
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.id = errorId;
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                errorElement.setAttribute('aria-live', 'polite');
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    async handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const btnText = submitBtn.querySelector('.btn-text');
        if (!btnText) return;
        
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
            // Scroll to first error
            const firstError = form.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        btnText.textContent = 'Enviando...';
        
        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Mensagem enviada com sucesso!', 'success');
            form.reset();
            
            // Clear all error messages
            form.querySelectorAll('.error-message').forEach(error => {
                error.textContent = '';
                error.style.display = 'none';
            });
            
            // Clear aria-invalid
            form.querySelectorAll('[aria-invalid]').forEach(field => {
                field.setAttribute('aria-invalid', 'false');
            });
            
        } catch (error) {
            this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.setAttribute('aria-busy', 'false');
            btnText.textContent = 'Enviar Mensagem';
        }
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

    // Parallax Effects - Desabilitado no Mobile
    setupParallax() {
        // Desabilitar parallax no mobile para melhor performance
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return;
        
        const parallaxElements = document.querySelectorAll('.shape');
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
                element.style.willChange = 'transform';
            });
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // Intersection Observer - Otimizado para Mobile
    setupIntersectionObserver() {
        const isMobile = window.innerWidth <= 768;
        
        // Configurações mais leves no mobile
        const observerOptions = {
            threshold: isMobile ? 0.2 : 0.1,
            rootMargin: isMobile ? '50px' : '0px 0px -50px 0px'
        };

        let animatedSections = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedSections.has(entry.target.id)) {
                    animatedSections.add(entry.target.id);
                    entry.target.classList.add('animate-in');
                    
                    // Reduzir animações no mobile
                    if (!isMobile) {
                        // Trigger specific animations based on section
                        if (entry.target.id === 'about') {
                            this.animateAboutSection();
                        } else if (entry.target.id === 'skills') {
                            this.animateSkillBars();
                        } else if (entry.target.id === 'work') {
                            this.animateWorkItems();
                        }
                    } else {
                        // Apenas animações essenciais no mobile
                        if (entry.target.id === 'skills') {
                            setTimeout(() => this.animateSkillBars(), 100);
                        }
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
    
    // Garantir que o link do JFAgende funciona - SOLUÇÃO FORÇADA
    const jfagendeLink = document.getElementById('jfagende-app-link');
    if (jfagendeLink) {
        // Remover qualquer listener existente
        const newLink = jfagendeLink.cloneNode(true);
        jfagendeLink.parentNode.replaceChild(newLink, jfagendeLink);
        
        // Adicionar listener que FORÇA a abertura
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            window.location.href = 'https://jf-agende.vercel.app/';
            return false;
        }, true); // Use capture phase
        
        // Também adicionar mousedown para garantir
        newLink.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        }, true);
    }
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
        // Debug logs removed for production
    });
}
