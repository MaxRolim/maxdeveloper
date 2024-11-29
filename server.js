const express = require('express'); // Importa o framework Express
const cors = require('cors'); // Importa o middleware CORS para permitir requisições entre origens diferentes
const nodemailer = require('nodemailer'); // Importa o Nodemailer para envio de emails
const path = require('path');
const app = express(); // Cria o app Express
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

app.use(cors({
    origin: 'https://maxrolim.github.io/maxdeveloper', // Permite qualquer origem
}));
app.use(express.json()); // Habilita o parse de JSON no corpo das requisições

// Configuração do transporte de email (usando Gmail como exemplo)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email remetente (configurado no .env)
        pass: process.env.EMAIL_PASS, // Senha ou senha de app (configurado no .env)
    },
    tls: {
        rejectUnauthorized: false, // Permite conexões não seguras (necessário em alguns casos)
    },
});


app.use(express.static(path.join(__dirname,'index.html')));
// Rota POST para enviar email
app.post('/send-email', async (req, res) => {
    const { email, message } = req.body; // Extrai o email e a mensagem do corpo da requisição

    // Valida os campos obrigatórios
    if (!email || !message) {
        res.status(400).send('Campos obrigatórios não preenchidos.');
        return;
    }

    try {
        // Envia o email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // Email remetente
            to: process.env.RECEIVE_EMAIL, // Email destinatário
            subject: 'Nova mensagem do chat', // Assunto do email
            text: `Mensagem: ${message}\nEmail do usuário: ${email}`, // Corpo do email
            replyTo: email, // Define o email do cliente como destinatário de respostas
        });

        console.log('E-mail enviado:', info.response); // Log de sucesso
        res.status(200).send('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error); // Log de erro
        res.status(500).send('Erro ao enviar email');
    }
});
//Isso garante que o seu servidor escute a porta que o Railway está configurando automaticamente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
// Inicia o servidor na porta 3000
