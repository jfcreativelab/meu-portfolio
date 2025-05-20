document.addEventListener('DOMContentLoaded', function() {
    // Elementos do chatbot
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Verificar se o chatbot já foi aberto antes
    const chatbotOpened = localStorage.getItem('chatbotOpened') || false;

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
        thanks: ["De nada!", "Disponha!", "Estou aqui para ajudar!", "Foi um prazer!"],
        suggestions: [
            {
                text: "Como funciona seu processo de trabalho?",
                response: "Meu processo de trabalho inclui: 1) Briefing e levantamento de requisitos, 2) Pesquisa e planejamento, 3) Design e prototipagem, 4) Desenvolvimento, 5) Testes e ajustes, 6) Entrega e suporte. Cada etapa é realizada com atenção aos detalhes e comunicação constante."
            },
            {
                text: "Quais tecnologias você utiliza?",
                response: "Trabalho com diversas tecnologias modernas como HTML5, CSS3, JavaScript (React, Vue.js), Python, Node.js, MongoDB, SQL, além de ferramentas de design como Figma, Adobe Illustrator e Photoshop. Estou sempre me atualizando com as últimas tendências e melhores práticas."
            },
            {
                text: "Quanto tempo leva para criar um site?",
                response: "O tempo de desenvolvimento varia conforme a complexidade do projeto. Um site institucional simples pode levar de 2 a 3 semanas, enquanto plataformas mais complexas como e-commerce ou sistemas web podem levar de 1 a 3 meses. Sempre estabeleço prazos realistas e mantenho o cliente informado sobre o progresso."
            }
        ]
    };

    // Função para adicionar mensagem ao chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Se não for mensagem do usuário, adicionar novas sugestões
        if (!isUser && Math.random() > 0.5) {
            addSuggestions();
        }
    }

    // Função para adicionar sugestões de perguntas
    function addSuggestions() {
        // Remover sugestões anteriores se existirem
        const oldSuggestions = chatbotMessages.querySelector('.chatbot-suggestions');
        if (oldSuggestions) {
            oldSuggestions.remove();
        }
        
        // Criar novas sugestões
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'chatbot-suggestions';
        
        // Selecionar 3 sugestões aleatórias sem repetição
        const allSuggestions = [...botResponses.suggestions];
        const selectedSuggestions = [];
        
        for (let i = 0; i < Math.min(3, allSuggestions.length); i++) {
            const randomIndex = Math.floor(Math.random() * allSuggestions.length);
            selectedSuggestions.push(allSuggestions[randomIndex]);
            allSuggestions.splice(randomIndex, 1);
        }
        
        // Adicionar chips de sugestão
        selectedSuggestions.forEach(suggestion => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion.text;
            chip.dataset.response = suggestion.response;
            
            chip.addEventListener('click', function() {
                addMessage(this.textContent, true);
                showTypingIndicator();
                
                setTimeout(() => {
                    removeTypingIndicator();
                    addMessage(this.dataset.response);
                }, 1000);
            });
            
            suggestionsDiv.appendChild(chip);
        });
        
        chatbotMessages.appendChild(suggestionsDiv);
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
            } else if (input.match(/servi[çc]os?|oferece|faz|trabalhos?/)) {
                response = botResponses.services;
            } else if (input.match(/contato|email|telefone|falar|mensagem/)) {
                response = botResponses.contact;
            } else if (input.match(/projetos?|portfolio|trabalhos?|exemplos?/)) {
                response = botResponses.projects;
            } else if (input.match(/habilidades?|skills|conhecimentos?|tecnologias?|stacks?/)) {
                response = botResponses.skills;
            } else if (input.match(/pre[çc]os?|valores?|custos?|or[çc]amentos?|quanto|cobran[çc]a/)) {
                response = botResponses.pricing;
            } else if (input.match(/prazos?|tempos?|dura[çc][ãa]o|quando|entrega/)) {
                response = botResponses.timeline;
            } else if (input.match(/obrigad[oa]|valeu|thanks|gracias|grato/)) {
                response = botResponses.thanks[Math.floor(Math.random() * botResponses.thanks.length)];
            } else {
                response = botResponses.default;
            }
            
            addMessage(response);
        }, 1000);
    }

    // Evento de toggle do chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotBox.classList.add('active');
        localStorage.setItem('chatbotOpened', true);
        
        // Se for a primeira vez que o usuário abre o chatbot, mostrar sugestões
        if (!chatbotOpened) {
            setTimeout(() => {
                addSuggestions();
            }, 1000);
        }
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

    // Inicializar sugestões clicáveis
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const question = this.dataset.question;
            addMessage(question, true);
            processUserInput(question);
        });
    });
});
