document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do slider de depoimentos
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Função para mostrar um slide específico
    function showSlide(n) {
        // Reseta o índice se estiver fora dos limites
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
        
        // Esconde todos os slides
        slides.forEach(slide => {
            slide.style.transform = `translateX(-${currentSlide * 100}%)`;
        });
        
        // Atualiza os dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Configurar os dots para navegação
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Avançar para o próximo slide automaticamente a cada 5 segundos
    setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 5000);
    
    // Inicializar o slider
    showSlide(currentSlide);
});
