const express = require('express');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;
const DEMO_MODE = String(process.env.DEMO_MODE || '').toLowerCase() === 'true';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../html/salita'a")));
// Resolver /favicon.ico (mesmo que o arquivo seja .jpg)
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, "../html/salita'a", "favicon.ico.jpg"));
});

// Preferir Resend se RESEND_API_KEY estiver configurada
const isResendEnabled = Boolean(process.env.RESEND_API_KEY);
let transporter = null;
let resendClient = null;

if (isResendEnabled) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
  console.log('📨 Envio de e-mail via Resend habilitado');
} else {
  // Fallback: Gmail via Nodemailer
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  console.log('📨 Envio de e-mail via Gmail/Nodemailer habilitado');
}

// Rota POST /contato
app.post('/contato', async (req, res) => {
  try {
    // Aceitar tanto os nomes antigos quanto os atuais do formulário
    const {
      nome,
      gmail,
      email,
      numero,
      telefone,
      descricao,
      mensagem
    } = req.body;

    // Validação dos campos obrigatórios
    const contatoEmail = email || gmail;
    const contatoNumero = telefone || numero;
    const contatoMensagem = mensagem || descricao;

    if (!nome || !contatoEmail || !contatoNumero || !contatoMensagem) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Configuração do e-mail
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER,
      replyTo: contatoEmail,
      subject: `Nova mensagem de contato - ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D9B84A; border-bottom: 2px solid #D9B84A; padding-bottom: 10px;">
            Nova mensagem do site Salita'a Cosmetic
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Informações do contato:</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${contatoEmail}</p>
            <p><strong>Número:</strong> ${contatoNumero}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Mensagem:</h3>
            <p style="line-height: 1.6; color: #555;">${contatoMensagem}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
            <p style="margin: 0; color: #2e7d32; font-size: 14px;">
              <strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      `
    };

    // Envio do e-mail
    try {
      if (isResendEnabled) {
        await resendClient.emails.send({
          from: process.env.RESEND_FROM || 'Salita\'a <onboarding@resend.dev>',
          to: process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER,
          reply_to: contatoEmail,
          subject: mailOptions.subject,
          html: mailOptions.html
        });
      } else {
        await transporter.sendMail(mailOptions);
      }
    } catch (sendErr) {
      console.error('Falha ao enviar e-mail:', sendErr?.message || sendErr);
      if (DEMO_MODE) {
        console.log('DEMO_MODE ativo. Registrando mensagem e retornando sucesso.');
        console.log({ nome, contatoEmail, contatoNumero, contatoMensagem });
      } else {
        throw sendErr;
      }
    }

    res.json({ success: true, message: 'Mensagem enviada com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API Salita\'a Cosmetic funcionando!',
    version: '1.0.0',
    endpoints: {
      'POST /contato': 'Enviar mensagem de contato'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📧 Destino: ${process.env.RECIPIENT_EMAIL || process.env.GMAIL_USER}`);
  if (isResendEnabled) {
    console.log('🔑 Resend ativo');
  } else {
    console.log(`📧 Remetente Gmail: ${process.env.GMAIL_USER}`);
  }
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

module.exports = app;
