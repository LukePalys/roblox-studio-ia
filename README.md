# 🤖 Roblox AI Assistant BETA v2.1

Assistente IA especializado em Roblox Studio para gerar e revisar scripts Luau com interface moderna estilo ChatGPT.

## ✨ Funcionalidades

- **🎯 IA Especializada**: Conhecimento avançado em Roblox Studio, serviços, RemoteEvents, padrões MVC
- **💬 Interface ChatGPT**: Sidebar com histórico de conversas e navegação intuitiva
- **🌓 Modo Claro/Escuro**: Alternância de temas com persistência por cookies
- **💾 Persistência Local**: Conversas salvas automaticamente por 30 dias
- **⌨️ Atalhos**: Ctrl+B (sidebar), Ctrl+Enter (gerar script)
- **📱 Responsivo**: Funciona perfeitamente em desktop e mobile
- **🔒 Seguro**: Armazenamento local via cookies, sem envio de dados

## 🚀 Como Usar

1. **Geração de Scripts**: Descreva o que você quer e a IA gera código Luau otimizado
2. **Revisão de Código**: Cole seu script existente para análise e sugestões
3. **Histórico**: Todas as conversas ficam salvas na sidebar
4. **Temas**: Alterne entre modo claro e escuro conforme preferir

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: FastAPI (Python)
- **IA**: OpenAI GPT-4o
- **Estilo**: Bootstrap 5 + Font Awesome
- **Deploy**: Replit / Vercel / Netlify

## 📦 Instalação Local

### Opção 1: Deploy Estático (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/lukepalys/roblox-ai-assistant.git
cd roblox-ai-assistant

# Serve os arquivos estáticos
python -m http.server 8000
# ou
npx serve .
```

### Opção 2: Com Backend FastAPI
```bash
# Instale as dependências
pip install fastapi uvicorn openai python-multipart

# Configure sua API key
export OPENAI_API_KEY="sua-chave-aqui"

# Execute o servidor
uvicorn server:app --host 0.0.0.0 --port 5000
```

## 🌐 Deploy Online

### GitHub Pages
1. Faça fork do repositório
2. Vá em Settings > Pages
3. Selecione "Deploy from a branch"
4. Escolha `main` branch e `/root` folder
5. Seu site estará em `https://seu-usuario.github.io/roblox-ai-assistant`

### Vercel
1. Conecte seu GitHub ao Vercel
2. Importe este repositório
3. Deploy automático configurado

### Netlify
1. Arraste a pasta do projeto para Netlify
2. Deploy instantâneo

## ⚙️ Configuração

### API Key Externa
O projeto usa uma API key pública para demonstração. Para uso em produção:

1. Obtenha sua chave da OpenAI: https://platform.openai.com/api-keys
2. Edite `static/script.js` linha 3:
```javascript
const API_KEY = "sua-chave-openai-aqui";
```

### Personalização
- **Cores**: Edite as variáveis CSS em `static/style.css`
- **Prompts IA**: Modifique `static/script.js` nas funções de geração
- **Idioma**: Altere textos em `index.html`

## 📝 Licença

MIT License - Sinta-se livre para usar e modificar!

## 🤝 Contribuição

Contribuições são bem-vindas! Abra issues ou pull requests.

## 📞 Suporte

- **GitHub Issues**: Para bugs e sugestões
- **Ou Acesse**: galaxia2964 no youtube! https://youtube.com/@galaxia2964?si=7nT87vWv_n0fe49V
- **Obrigado**
---

⭐ **Se este projeto te ajudou, deixe uma estrela no GitHub!**


🎮 **Feito com ❤️ para a comunidade Roblox Brasil**
