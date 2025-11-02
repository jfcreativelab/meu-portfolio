document.addEventListener('DOMContentLoaded', function() {
    // Elementos do alternador de tema
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Verificar preferência salva do usuário
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Definir tema inicial com base na preferência salva ou sistema
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }
    
    // Função para alternar o tema
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar animação de transição
        document.body.classList.add('theme-transition');
        
        // Alterar o tema
        html.setAttribute('data-theme', newTheme);
        
        // Salvar preferência do usuário
        localStorage.setItem('theme', newTheme);
        
        // Anunciar mudança de tema para leitores de tela
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('class', 'sr-only');
        announcement.textContent = `Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`;
        document.body.appendChild(announcement);
        
        // Remover anúncio após leitura
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 3000);
        
        // Remover classe de transição após a animação
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }
    
    // Adicionar evento de clique ao botão
    themeToggle.addEventListener('click', toggleTheme);
    
    // Adicionar evento para mudanças na preferência do sistema
    prefersDarkScheme.addEventListener('change', (e) => {
        // Só alterar automaticamente se o usuário não tiver uma preferência salva
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
    
    // Adicionar classe para animação ao carregar a página
    setTimeout(() => {
        document.body.classList.add('theme-loaded');
    }, 300);
    
    // Adicionar atalho de teclado (opcional)
    document.addEventListener('keydown', (e) => {
        // Alt + T para alternar tema
        if (e.altKey && e.key === 't') {
            toggleTheme();
        }
    });
    
    // Adicionar dica de atalho ao passar o mouse (tooltip)
    themeToggle.setAttribute('title', 'Alternar tema (Alt+T)');
    
    // Função para aplicar ajustes específicos baseados no tema atual
    function applyThemeSpecificAdjustments() {
        const currentTheme = html.getAttribute('data-theme');
        
        // Ajustar elementos específicos com base no tema
        if (currentTheme === 'light') {
            // Ajustes para tema claro
            document.querySelectorAll('.matrix-effect').forEach(el => {
                el.style.opacity = '0.1';
            });
            
            // Ajustar contraste de elementos se necessário
            document.querySelectorAll('.skill-icon, .timeline-icon').forEach(el => {
                el.style.color = 'var(--background-color)';
            });
        } else {
            // Ajustes para tema escuro
            document.querySelectorAll('.matrix-effect').forEach(el => {
                el.style.opacity = '1';
            });
            
            // Restaurar estilos padrão
            document.querySelectorAll('.skill-icon, .timeline-icon').forEach(el => {
                el.style.color = '';
            });
        }
    }
    
    // Aplicar ajustes iniciais
    applyThemeSpecificAdjustments();
    
    // Observar mudanças no atributo data-theme
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                applyThemeSpecificAdjustments();
            }
        });
    });
    
    observer.observe(html, { attributes: true });
});
