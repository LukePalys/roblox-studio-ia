// Roblox AI Assistant JavaScript - v2.1 BETA com Sidebar e Temas
// Configuração da API externa do usuário
const API_KEY = "sk-YFtEcctGY3Vq8UiyRoGxh7JzJ4QHzccM9nqCSGR559LghMRf";
const API_URL = "https://api.chatanywhere.tech/v1";

// Cache para melhor performance
const cache = new Map();
const MAX_CACHE_SIZE = 50;

// Sistema de histórico e persistência
let chatHistory = [];
let currentChatId = null;

// Configurações de cookies
const COOKIE_EXPIRY_DAYS = 30;

document.addEventListener('DOMContentLoaded', function() {
    const generateForm = document.getElementById('generateForm');
    const reviewForm = document.getElementById('reviewForm');
    
    // Inicialização
    initializeApp();
    initializeSidebar();
    initializeTheme();
    
    // Handle script generation com API externa
    generateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const description = document.getElementById('scriptDescription').value.trim();
        const generateBtn = document.getElementById('generateBtn');
        const resultDiv = document.getElementById('generateResult');
        const errorDiv = document.getElementById('generateError');
        
        if (!description || description.length < 5) {
            showError('generateError', 'Por favor, forneça uma descrição mais detalhada (mínimo 5 caracteres).');
            return;
        }
        
        // Check cache first
        const cacheKey = `generate_${description}`;
        if (cache.has(cacheKey)) {
            const cachedResult = cache.get(cacheKey);
            document.getElementById('generatedScript').textContent = cachedResult;
            showElement(resultDiv, 'fade-in');
            return;
        }
        
        // Reset previous results
        hideElement(resultDiv);
        hideElement(errorDiv);
        
        // Show loading state
        setLoading(generateBtn, true);
        
        try {
            const response = await fetch(`${API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "Você é um ESPECIALISTA AVANÇADO em Roblox Studio e programação Luau. " +
                                   "Características importantes: " +
                                   "• Conheça TODOS os serviços do Roblox (Players, Workspace, ReplicatedStorage, etc.) " +
                                   "• Use RemoteEvents e RemoteFunctions corretamente para client-server " +
                                   "• Implemente padrões como MVC, Singleton quando apropriado " +
                                   "• Crie scripts otimizados e eficientes " +
                                   "• Sempre inclua comentários detalhados em português " +
                                   "• Use ModuleScripts para organização de código " +
                                   "• Implemente tratamento de erros com pcall/xpcall " +
                                   "• Use as melhores práticas de performance do Roblox " +
                                   "• Considere segurança (FilteringEnabled, exploits) " +
                                   "• Seja específico sobre onde colocar scripts (ServerScript vs LocalScript)"
                        },
                        {
                            role: "user",
                            content: `Crie um script Luau para Roblox Studio que: ${description}`
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.1
                })
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const script = data.choices[0].message.content;
                document.getElementById('generatedScript').textContent = script;
                
                // Cache the result
                addToCache(cacheKey, script);
                
                showElement(resultDiv, 'fade-in');
                
                // Log success
                console.log('Script gerado com sucesso');
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('Erro ao gerar script:', error);
            showError('generateError', `Erro: ${error.message}. Verifique sua conexão e API key.`);
        } finally {
            setLoading(generateBtn, false);
        }
    });
    
    // Handle script review com API externa
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('scriptFile');
        const file = fileInput.files[0];
        const reviewBtn = document.getElementById('reviewBtn');
        const resultDiv = document.getElementById('reviewResult');
        const errorDiv = document.getElementById('reviewError');
        
        if (!file) {
            showError('reviewError', 'Por favor, selecione um arquivo.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('reviewError', 'Arquivo muito grande. Máximo 5MB.');
            return;
        }
        
        // Reset previous results
        hideElement(resultDiv);
        hideElement(errorDiv);
        
        // Show loading state
        setLoading(reviewBtn, true);
        
        try {
            // Read file content
            const fileText = await file.text();
            
            if (fileText.trim().length < 10) {
                showError('reviewError', 'Arquivo muito pequeno para análise (mínimo 10 caracteres).');
                setLoading(reviewBtn, false);
                return;
            }
            
            // Analyze with external API
            const response = await fetch(`${API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system", 
                            content: "Você é um REVISOR ESPECIALISTA em Roblox Studio e Luau. " +
                                   "Analise o código considerando: " +
                                   "• Eficiência e performance no Roblox " +
                                   "• Uso correto de serviços e APIs do Roblox " +
                                   "• Segurança (exploits, FilteringEnabled) " +
                                   "• Organização e legibilidade do código " +
                                   "• Melhores práticas de programação Luau " +
                                   "• Compatibilidade com o ecossistema Roblox " +
                                   "Responda em JSON com: " +
                                   "'analysis' (análise técnica detalhada), " +
                                   "'suggestions' (melhorias específicas), " +
                                   "'rating' (Excelente/Bom/Regular/Precisa Melhorar), " +
                                   "'security_notes' (observações de segurança). " +
                                   "Seja técnico e educativo."
                        },
                        {
                            role: "user",
                            content: `Analise este script do Roblox Studio:\n\n\`\`\`luau\n${fileText}\n\`\`\``
                        }
                    ],
                    max_tokens: 1200,
                    temperature: 0.2,
                    response_format: { type: "json_object" }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                let result;
                try {
                    result = JSON.parse(data.choices[0].message.content);
                } catch (parseError) {
                    // Fallback se JSON parsing falhar
                    result = {
                        analysis: data.choices[0].message.content,
                        suggestions: ["Análise detalhada fornecida acima"],
                        rating: "Analisado"
                    };
                }
                
                // Display results
                document.getElementById('reviewFilename').textContent = file.name;
                document.getElementById('reviewRating').textContent = result.rating || 'Não classificado';
                document.getElementById('reviewAnalysis').textContent = result.analysis || 'Análise não disponível';
                
                // Display suggestions
                const suggestionsList = document.getElementById('reviewSuggestions');
                suggestionsList.innerHTML = '';
                
                const suggestions = result.suggestions || [];
                if (suggestions.length > 0) {
                    suggestions.forEach((suggestion, index) => {
                        const li = document.createElement('li');
                        li.textContent = suggestion;
                        suggestionsList.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = 'Nenhuma sugestão específica fornecida.';
                    suggestionsList.appendChild(li);
                }
                
                showElement(resultDiv, 'fade-in');
                console.log('Script analisado com sucesso');
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('Erro ao analisar script:', error);
            showError('reviewError', `Erro: ${error.message}. Verifique sua conexão e API key.`);
        } finally {
            setLoading(reviewBtn, false);
        }
    });
});

// Initialization function
function initializeApp() {
    console.log('🤖 Roblox AI Assistant BETA v2.1 inicializado - Especialista em Roblox Studio');
    
    // Load chat history from cookies
    loadChatHistory();
    
    // Create initial chat if none exists
    if (chatHistory.length === 0) {
        createNewChat();
    }
    
    // Test API connectivity
    testAPIConnection();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter para gerar script
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const generateForm = document.getElementById('generateForm');
            if (generateForm && document.activeElement.closest('#generateForm')) {
                e.preventDefault();
                generateForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Ctrl/Cmd + B para toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
    });
}

// Sidebar functions
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const newChatBtn = document.getElementById('newChatBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    console.log('Inicializando sidebar...');
    
    // Event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Toggle sidebar clicado');
            toggleSidebar();
        });
    }
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createNewChat();
        });
    }
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearChatHistory();
        });
    }
    
    // Prevent sidebar clicks from closing it
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close sidebar when clicking outside (delay to avoid immediate closure)
    setTimeout(() => {
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            
            if (sidebar && sidebarToggle && sidebar.classList.contains('show')) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    console.log('Clique fora da sidebar, fechando...');
                    toggleSidebar();
                }
            }
        });
    }, 100);
    
    // Close sidebar with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('show')) {
                console.log('Escape pressionado, fechando sidebar');
                toggleSidebar();
            }
        }
    });
    
    updateChatHistoryDisplay();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (!sidebar || !mainContent || !sidebarToggle) {
        console.error('Elementos da sidebar não encontrados');
        return;
    }
    
    const isOpen = sidebar.classList.contains('show');
    console.log('Estado atual da sidebar:', isOpen ? 'aberta' : 'fechada');
    
    if (isOpen) {
        // Fechar sidebar
        console.log('Fechando sidebar...');
        sidebar.classList.remove('show');
        mainContent.classList.remove('shifted');
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggle.setAttribute('aria-label', 'Abrir menu');
    } else {
        // Abrir sidebar
        console.log('Abrindo sidebar...');
        sidebar.classList.add('show');
        if (window.innerWidth > 768) {
            mainContent.classList.add('shifted');
        }
        sidebarToggle.innerHTML = '<i class="fas fa-times"></i>';
        sidebarToggle.setAttribute('aria-label', 'Fechar menu');
    }
    
    // Log da transformação
    console.log('Transform aplicado:', getComputedStyle(sidebar).transform);
}

function createNewChat() {
    const chatId = 'chat_' + Date.now();
    const newChat = {
        id: chatId,
        title: 'Nova Conversa',
        messages: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    };
    
    chatHistory.unshift(newChat);
    currentChatId = chatId;
    
    // Clear current form data
    clearCurrentSession();
    
    saveChatHistory();
    updateChatHistoryDisplay();
    
    console.log('Nova conversa criada:', chatId);
}

function clearCurrentSession() {
    // Clear form inputs
    const generateForm = document.getElementById('generateForm');
    const reviewForm = document.getElementById('reviewForm');
    
    if (generateForm) generateForm.reset();
    if (reviewForm) reviewForm.reset();
    
    // Hide result divs
    hideElement(document.getElementById('generateResult'));
    hideElement(document.getElementById('reviewResult'));
    hideElement(document.getElementById('generateError'));
    hideElement(document.getElementById('reviewError'));
}

function updateChatHistoryDisplay() {
    const historyContainer = document.getElementById('chatHistory');
    
    if (chatHistory.length === 0) {
        historyContainer.innerHTML = '<p class="text-muted text-center">Nenhuma conversa ainda</p>';
        return;
    }
    
    historyContainer.innerHTML = chatHistory.map(chat => {
        const date = new Date(chat.lastActivity).toLocaleDateString('pt-BR');
        const preview = chat.messages.length > 0 ? 
            chat.messages[chat.messages.length - 1].preview : 
            'Conversa vazia';
        
        return `
            <div class="chat-item ${chat.id === currentChatId ? 'active' : ''}" 
                 onclick="loadChat('${chat.id}')">
                <div class="chat-item-title">${chat.title}</div>
                <div class="chat-item-preview">${preview}</div>
                <div class="chat-item-date">${date}</div>
            </div>
        `;
    }).join('');
}

function loadChat(chatId) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    updateChatHistoryDisplay();
    
    // Load last message if exists
    if (chat.messages.length > 0) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        
        if (lastMessage.type === 'generate') {
            document.getElementById('scriptDescription').value = lastMessage.input;
            if (lastMessage.output) {
                document.getElementById('generatedScript').textContent = lastMessage.output;
                showElement(document.getElementById('generateResult'));
            }
        }
    }
    
    console.log('Conversa carregada:', chatId);
}

function saveToHistory(type) {
    if (!currentChatId) createNewChat();
    
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (!chat) return;
    
    let message = {};
    
    if (type === 'generate') {
        const input = document.getElementById('scriptDescription').value;
        const output = document.getElementById('generatedScript').textContent;
        
        message = {
            type: 'generate',
            input: input,
            output: output,
            preview: input.substring(0, 60) + (input.length > 60 ? '...' : ''),
            timestamp: new Date().toISOString()
        };
        
        // Update chat title with first meaningful input
        if (chat.title === 'Nova Conversa' && input.length > 10) {
            chat.title = input.substring(0, 30) + (input.length > 30 ? '...' : '');
        }
    }
    
    chat.messages.push(message);
    chat.lastActivity = new Date().toISOString();
    
    saveChatHistory();
    updateChatHistoryDisplay();
    
    showSuccessMessage('Conversa salva no histórico!');
}

function clearChatHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico de conversas?')) {
        chatHistory = [];
        currentChatId = null;
        saveChatHistory();
        updateChatHistoryDisplay();
        clearCurrentSession();
        createNewChat();
        
        showSuccessMessage('Histórico limpo com sucesso!');
    }
}

// Theme functions
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    // Load saved theme
    const savedTheme = getCookie('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        setCookie('theme', newTheme, COOKIE_EXPIRY_DAYS);
    });
}

function setTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (theme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Modo Escuro';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Modo Claro';
    }
}

// Test API connection
async function testAPIConnection() {
    try {
        const response = await fetch(`${API_URL}/models`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        if (response.ok) {
            console.log('✅ Conexão com API estabelecida');
        } else {
            console.warn('⚠️ Problema na conexão com API');
        }
    } catch (error) {
        console.warn('⚠️ Não foi possível testar a conexão com API:', error.message);
    }
}

// Cache management
function addToCache(key, value) {
    if (cache.size >= MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    cache.set(key, value);
}

// Cookie functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Storage functions
function saveChatHistory() {
    try {
        const historyData = {
            version: '2.1',
            history: chatHistory,
            currentChatId: currentChatId,
            lastSaved: new Date().toISOString()
        };
        setCookie('chatHistory', JSON.stringify(historyData), COOKIE_EXPIRY_DAYS);
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

function loadChatHistory() {
    try {
        const savedData = getCookie('chatHistory');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.version === '2.1' && parsedData.history) {
                chatHistory = parsedData.history;
                currentChatId = parsedData.currentChatId;
                console.log('Histórico carregado:', chatHistory.length, 'conversas');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        chatHistory = [];
    }
}

function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success position-fixed';
    successDiv.style.cssText = `
        top: 20px; 
        right: 20px; 
        z-index: 9999; 
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    successDiv.innerHTML = `<i class="fas fa-check me-2"></i>${message}`;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function showElement(element, animationClass = '') {
    element.style.display = 'block';
    if (animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => element.classList.remove(animationClass), 500);
    }
}

function hideElement(element) {
    element.style.display = 'none';
}

function showError(errorDivId, message) {
    const errorDiv = document.getElementById(errorDivId);
    const errorMsg = document.getElementById(errorDivId.replace('Error', 'ErrorMsg'));
    
    errorMsg.textContent = message;
    showElement(errorDiv, 'fade-in');
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        const originalText = button.innerHTML;
        button.setAttribute('data-original-text', originalText);
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback();
        } else {
            console.error('Fallback: Copying text command was unsuccessful');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyFeedback() {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'alert alert-success position-fixed';
    feedback.style.top = '20px';
    feedback.style.right = '20px';
    feedback.style.zIndex = '9999';
    feedback.innerHTML = '<i class="fas fa-check me-2"></i>Código copiado!';
    
    document.body.appendChild(feedback);
    
    // Remove after 2 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// File input validation
document.getElementById('scriptFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const validExtensions = ['.lua', '.luau', '.txt'];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!isValid) {
            showError('reviewError', 'Tipo de arquivo inválido. Use apenas .lua, .luau ou .txt');
            e.target.value = '';
            return;
        }
        
        if (file.size > 1024 * 1024) {
            showError('reviewError', 'Arquivo muito grande. Máximo 1MB.');
            e.target.value = '';
            return;
        }
        
        // Clear any previous errors
        hideElement(document.getElementById('reviewError'));
    }
});
