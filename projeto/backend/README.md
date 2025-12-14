# Backend Salita'a Cosmetic

API Node.js com Express para processar mensagens de contato e enviar e-mails via Nodemailer.

## 🚀 Configuração

### 1. Instalar dependências
```bash
cd projeto/backend
npm install
```

### 2. Configurar Gmail
1. Ative a verificação em 2 etapas na sua conta Google
2. Gere uma senha de app:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "E-mail" e "Outro (nome personalizado)"
   - Digite "Salita'a Backend"
   - Copie a senha gerada

### 3. Configurar variáveis de ambiente
Edite o arquivo `config.env`:
```env
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=sua-senha-de-app-aqui
PORT=3000
NODE_ENV=development
```

### 4. Executar o servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

## 📡 Endpoints

### POST /contato
Recebe dados de contato e envia e-mail.

**Campos obrigatórios:**
- `nome` (string)
- `gmail` (string, e-mail válido)
- `numero` (string, telefone)
- `descricao` (string, mensagem)

**Exemplo de requisição:**
```json
{
  "nome": "João Silva",
  "gmail": "joao@gmail.com",
  "numero": "+245 956 88 33 63",
  "descricao": "Gostaria de saber mais sobre os produtos."
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso!"
}
```

## 🧪 Teste

Abra `formulario-teste.html` no navegador para testar a API.

## 📧 E-mail

Os e-mails são enviados para o Gmail configurado em `GMAIL_USER` com:
- Assunto: "Nova mensagem de contato - [Nome]"
- HTML formatado com todas as informações
- Data e hora da mensagem

## 🔧 Estrutura

```
backend/
├── server.js              # Servidor principal
├── package.json           # Dependências
├── config.env            # Variáveis de ambiente
├── formulario-teste.html # Formulário para teste
└── README.md             # Esta documentação
```
