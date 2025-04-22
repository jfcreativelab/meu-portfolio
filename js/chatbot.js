document.addEventListener('DOMContentLoaded', function() {
    // Elementos do chatbot
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');
    
    // Respostas pré-definidas do chatbot
    const botResponses = {
        default: "Desculpe, não entendi sua pergunta. Você pode perguntar sobre meus serviços, projetos, ou como entrar em contato.",
        greeting: ["Olá!", "Oi, como posso ajudar?", "Olá! Como posso ser útil hoje?"],
        services: "Ofereço serviços de desenvolvimento web full stack e design, incluindo criação de sites, aplicativos, logotipos e identidade visual. Cada projeto é personalizado para atender às necessidades específicas do cliente.",
        contact: "Você pode entrar em contato através do formulário no site, pelo e-mail contato@jfcreativelab.com, ou pelas redes sociais listadas na seção de contato.",
        projects: "Atualmente, meus principais projetos incluem o marketplace Sub-Zero Skins e diversos trabalhos de design de logotipos. Você pode ver mais detalhes na seção de projetos do site.",
        skills: "Minhas principais habilidades incluem HTML, CSS, JavaScript, Python, React, Node.js, SQL e design gráfico com ferramentas como Figma e Adobe Illustrator.",
        pricing: "Os preços variam de acordo com a complexidade e escopo de cada projeto. Entre em contato para discutirmos suas necessidades e receber um orçamento personalizado.",
        timeline: "O prazo de entrega depende da complexidade do projeto. Geralmente, um site simples leva de 1 a 2 semanas, enquanto projetos mais complexos podem levar de 1 a 3 meses.",
        thanks: ["De nada!", "Disponha!", "Estou aqui para ajudar!", "Foi um prazer!"]
    };
    
    // Função para adicionar mensagem ao chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Função para mostrar indicador de digitação
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingDiv.id = 'typing-indicator';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Função para remover indicador de digitação
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Função para processar a entrada do usuário e gerar resposta
    function processUserInput(input) {
        input = input.toLowerCase().trim();
        
        // Mostrar indicador de digitação
        showTypingIndicator();
        
        // Simular tempo de resposta
        setTimeout(() => {
            removeTypingIndicator();
            
            // Lógica para determinar a resposta
            let response;
            
            if (input.match(/ol[aá]|oi|hey|hi|hello/)) {
                response = botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
            } 
            else if (input.match(/servi[çc]os?|oferece|faz|trabalhos?/)) {
                response = botResponses.services;
            }
            else if (input.match(/contato|email|telefone|falar|mensagem/)) {
                response = botResponses.contact;
            }
            else if (input.match(/projetos?|portfolio|trabalhos?|exemplos?/)) {
                response = botResponses.projects;
            }
            else if (input.match(/habilidades?|skills|conhecimentos?|tecnologias?|stacks?/)) {
                response = botResponses.skills;
            }
            else if (input.match(/pre[çc]os?|valores?|custos?|or[çc]amentos?|quanto|cobran[çc]a/)) {
                response = botResponses.pricing;
            }
            else if (input.match(/prazos?|tempos?|dura[çc][ãa]o|quando|entrega/)) {
                response = botResponses.timeline;
            }
            else if (input.match(/obrigad[oa]|valeu|thanks|gracias|grato/)) {
                response = botResponses.thanks[Math.floor(Math.random() * botResponses.thanks.length)];
            }
            else {
                response = botResponses.default;
            }
            
            addMessage(response);
        }, 1000);
    }
    
    // Evento de toggle do chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotBox.classList.add('active');
    });
    
    // Evento de fechar o chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotBox.classList.remove('active');
    });
    
    // Evento de enviar mensagem
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            processUserInput(message);
        }
    }
    
    chatbotSend.addEventListener('click', sendMessage);
    
    // Enviar mensagem ao pressionar Enter
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
