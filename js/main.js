document.addEventListener('DOMContentLoaded', function() {
    // === Navegação Suave ===
    document.querySelectorAll('nav ul li a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // === Sistema de Partículas Flutuantes ===
    function createParticles() {
      const container = document.getElementById('particles-container');
      if (!container) return;

      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição aleatória
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tamanho aleatório
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Delay de animação aleatório
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        container.appendChild(particle);
      }
    }

    // === Animação de Contadores ===
    function animateCounters() {
      const counters = document.querySelectorAll('.stat-number');
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
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

    // === Animação das Barras de Habilidade ===
    function animateSkillBars() {
      const skillItems = document.querySelectorAll('.skill-item');
      
      skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-progress');
        const width = progressBar.getAttribute('data-width');
        
        setTimeout(() => {
          progressBar.style.width = width;
        }, 200);
      });
    }

    // === Intersection Observer para animações ===
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar contadores quando a seção home for visível
          if (entry.target.id === 'home') {
            setTimeout(animateCounters, 500);
          }
          
          // Animar barras de habilidade quando a seção about for visível
          if (entry.target.id === 'about') {
            setTimeout(animateSkillBars, 300);
          }
          
          // Adicionar classe de animação aos elementos
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, observerOptions);

    // Observar seções
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    // === Scroll Indicator Click ===
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({
          behavior: 'smooth'
        });
      });
    }
  
    // === Efeito Matrix ===
    const matrixContainer = document.querySelector('.matrix-effect');
    const canvas = document.createElement('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixContainer.appendChild(canvas);
  
    const ctx = canvas.getContext('2d');
    const fontSize = 20;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1); // Posição inicial de cada coluna
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  
    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00FF99'; // Verde neon
      ctx.font = `${fontSize}px monospace`;
  
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
  
        // Reinicia a coluna se ultrapassar a tela e com chance aleatória
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
  
    setInterval(drawMatrix, 50);
  
    // Ajusta o canvas ao redimensionar a janela
    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  
    // === Menu Mobile ===
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.overlay');
  
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      overlay.classList.toggle('active');
    });
  
    overlay.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      overlay.classList.remove('active');
    });
  
    // Fechar o menu ao clicar em um link
    document.querySelectorAll('.nav-menu ul li a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        overlay.classList.remove('active');
      });
    });

    // === Inicializar Partículas ===
    createParticles();

    // === Efeito Parallax Suave ===
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.floating-particles');
      
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    });
  
    // === Modal de Logotipos ===
    document.querySelector('.btn[data-target="logoModal"]').addEventListener('click', function() {
      document.getElementById('logoModal').style.display = 'block';
    });
  
    document.querySelector('.close').addEventListener('click', function() {
      document.getElementById('logoModal').style.display = 'none';
    });
  
    window.onclick = function(event) {
      if (event.target === document.getElementById('logoModal')) {
        document.getElementById('logoModal').style.display = 'none';
      }
    };
  });