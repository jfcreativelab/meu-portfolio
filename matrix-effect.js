// Efeito Matrix Simples e Direto
console.log('Carregando efeito Matrix...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado!');
    
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(function() {
        initMatrixEffect();
    }, 500);
});

function initMatrixEffect() {
    console.log('Iniciando efeito Matrix...');
    
    // Verificar se o elemento existe
    let matrixBg = document.getElementById('matrix-bg');
    if (!matrixBg) {
        console.error('Elemento matrix-bg não encontrado!');
        return;
    }
    
    console.log('Elemento matrix-bg encontrado!');
    
    // Limpar qualquer conteúdo anterior
    matrixBg.innerHTML = '';
    
    // Caracteres do Matrix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Criar colunas
    const columnCount = Math.floor(window.innerWidth / 25);
    console.log(`Criando ${columnCount} colunas...`);
    
    for (let i = 0; i < columnCount; i++) {
        createMatrixColumn(i);
    }
    
    // Continuar criando colunas
    setInterval(function() {
        createMatrixColumn();
    }, 400);
    
    function createMatrixColumn(index = null) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        
        // Posição aleatória
        const left = Math.random() * (window.innerWidth - 20);
        column.style.left = left + 'px';
        
        // Velocidade aleatória
        const duration = Math.random() * 3 + 2;
        column.style.animationDuration = duration + 's';
        
        // Delay aleatório
        const delay = Math.random() * 2;
        column.style.animationDelay = delay + 's';
        
        // Criar caracteres
        const charCount = Math.floor(Math.random() * 12) + 6;
        for (let i = 0; i < charCount; i++) {
            const char = document.createElement('span');
            char.className = 'matrix-character';
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.animationDelay = Math.random() * 2 + 's';
            column.appendChild(char);
        }
        
        // Adicionar ao background
        matrixBg.appendChild(column);
        
        // Remover após animação
        setTimeout(function() {
            if (column && column.parentNode) {
                column.remove();
            }
        }, (duration + delay + 1) * 1000);
    }
    
    console.log('Efeito Matrix iniciado com sucesso!');
}
