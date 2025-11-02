// Sistema Avançado de Depoimentos
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoPlayInterval;
    
    // Função para atualizar o carousel
    function updateCarousel() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Atualizar track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Atualizar cards
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentSlide) {
                setTimeout(() => {
                    card.classList.add('active');
                }, 100);
            }
        });
        
        // Atualizar dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
        
        // Reset animação
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    // Função para próximo slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % cards.length;
        updateCarousel();
    }
    
    // Função para slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + cards.length) % cards.length;
        updateCarousel();
    }
    
    // Função para ir para slide específico
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Reinicia após 10s
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Reinicia após 10s
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000); // Reinicia após 10s
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/Swipe support
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    if (track) {
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            stopAutoPlay();
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Se o movimento horizontal for maior que o vertical, prevenir scroll
            if (diffX > diffY) {
                e.preventDefault();
            }
        });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            setTimeout(startAutoPlay, 5000);
        });
    }
    
    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Intersection Observer para iniciar auto-play quando visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(startAutoPlay, 1000);
            } else {
                stopAutoPlay();
            }
        });
    }, { threshold: 0.5 });
    
    if (carousel) {
        observer.observe(carousel);
    }
    
    // Inicializar
    updateCarousel();
    
    // Animações de entrada dos cards
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fadeIn');
    });
    
    // Animar estatísticas
    function animateStats() {
        const statNumbers = document.querySelectorAll('.testimonials-stats .stat-number');
        
        statNumbers.forEach((stat, index) => {
            const finalValue = stat.textContent;
            const isPercentage = finalValue.includes('%');
            const isStar = finalValue.includes('★');
            const isPlus = finalValue.includes('+');
            
            let numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            if (numericValue) {
                let current = 0;
                const increment = numericValue / 50; // 50 steps
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        let displayValue = Math.floor(current);
                        if (isPercentage) displayValue += '%';
                        if (isPlus) displayValue += '+';
                        if (isStar) displayValue = '5★';
                        stat.textContent = displayValue;
                    }
                }, 50);
            }
        });
    }
    
    // Animar estatísticas quando a seção for visível
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 500);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        statsObserver.observe(testimonialsSection);
    }
});
