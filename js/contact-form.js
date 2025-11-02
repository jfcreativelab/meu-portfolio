// Sistema Avançado de Formulário de Contato
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const charCount = document.getElementById('char-count');
    const messageField = document.getElementById('message');
    const phoneField = document.getElementById('phone');
    
    // Máscara para telefone
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            e.target.value = value;
        });
    }
    
    // Contador de caracteres para mensagem
    if (messageField && charCount) {
        messageField.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 450) {
                charCount.style.color = var('--accent-color');
            } else if (length > 400) {
                charCount.style.color = '#ffa500';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(fieldName + '-error');
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Nome deve conter apenas letras';
                }
                break;
                
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'E-mail inválido';
                }
                break;
                
            case 'phone':
                if (value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Formato de telefone inválido';
                }
                break;
                
            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Selecione um assunto';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                } else if (value.length > 500) {
                    isValid = false;
                    errorMessage = 'Mensagem deve ter no máximo 500 caracteres';
                }
                break;
                
            case 'privacy':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Você deve aceitar a política de privacidade';
                }
                break;
        }
        
        if (isValid) {
            clearFieldError(field, errorElement);
        } else {
            showFieldError(field, errorElement, errorMessage);
        }
        
        return isValid;
    }
    
    function showFieldError(field, errorElement, message) {
        field.style.borderColor = 'var(--accent-color)';
        field.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function clearFieldError(field, errorElement) {
        field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        field.style.boxShadow = 'none';
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    function clearError(e) {
        const field = e.target;
        const errorElement = document.getElementById(field.name + '-error');
        clearFieldError(field, errorElement);
    }
    
    // Validação do formulário completo
    function validateForm() {
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }
        
        // Mostrar estado de loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simular envio (substitua pela sua lógica real)
        setTimeout(() => {
            // Sucesso
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            
            // Limpar formulário após 2 segundos
            setTimeout(() => {
                form.reset();
                charCount.textContent = '0';
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                
                // Limpar todos os erros visuais
                inputs.forEach(input => {
                    clearFieldError(input, document.getElementById(input.name + '-error'));
                });
            }, 2000);
            
        }, 2000); // Simular delay de envio
        
        // Para envio real com Formspree ou outro serviço:
        /*
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                showNotification('Mensagem enviada com sucesso!', 'success');
                
                setTimeout(() => {
                    form.reset();
                    charCount.textContent = '0';
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error('Erro no envio');
            }
        })
        .catch(error => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        });
        */
    });
    
    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remover notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : type === 'error' ? 'linear-gradient(135deg, #f44336, #d32f2f)' : 'linear-gradient(135deg, var(--tertiary-color), var(--primary-color))'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // Animações de entrada dos campos
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Auto-focus no primeiro campo
    const firstInput = form.querySelector('input[required]');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
        }, 500);
    }
});
