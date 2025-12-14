# Backend de Contato (Node.js + Express + Email)

## Requisitos
- Node.js 18+

## Instalação
1. Abra um terminal nessa pasta:
   - Windows PowerShell:
     ```powershell
     cd "C:\\Users\\Admin1\\Desktop\\site\\projeto\\backend"
     ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. (Recomendado) Crie um arquivo `.env` em `backend/` para configurar:
   ```env
   PORT=3001
   FRONTEND_ORIGIN=*
   # SMTP (obrigatório para enviar email)
   SMTP_HOST=smtp.seuprovedor.com
   SMTP_PORT=587
   SMTP_USER=seu_usuario
   SMTP_PASS=sua_senha
   TO_EMAIL=seu_destino@gmail.com
   ```

## Executar
- Desenvolvimento (reinicia ao salvar):
  ```bash
  npm run dev
  ```
- Produção:
  ```bash
  npm start
  ```

O servidor iniciará em `http://localhost:3001`.

## Endpoints
- `GET /health`: status do servidor
- `POST /api/contatos` (JSON):
  ```json
  { "nome": "", "email": "", "telefone": "", "mensagem": "" }
  ```

## Onde o banco fica
- Em `backend/data/contatos.db` (criado automaticamente na primeira execução)

## Ajustar o frontend
- O formulário em `html/salita'a/salita.html` já aponta para `http://localhost:3001/api/contatos`.
- Se publicar o backend em outro domínio, atualize o atributo `action` do formulário e a variável `FRONTEND_ORIGIN` no `.env` do backend.

## Autenticação Básica (opcional)
- Para habilitar, defina `BASIC_AUTH_USER` e `BASIC_AUTH_PASS` no `.env`.
- Para consultar `GET /api/contatos` com curl:
  ```bash
  curl -u admin:troque-esta-senha http://localhost:3001/api/contatos
  ```

