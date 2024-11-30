const nodemailer = require('nodemailer');
const cors = require('cors');

module.exports = async (req, res) => {
  // Configuração do CORS para permitir requisições do seu frontend
  cors({
    origin: 'https://maxdeveloper.vercel.app/api/send-email', // Altere se o domínio do seu frontend mudar
  })(req, res, async () => {
    // Verifica se o método da requisição é POST
    if (req.method === 'POST') {
      const { email, message } = req.body; // Extrai os dados do corpo da requisição

      // Valida os campos obrigatórios
      if (!email || !message) {
        return res.status(400).send('Campos obrigatórios não preenchidos.');
      }

      try {
        // Configuração do transporte de email usando o Nodemailer
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Ou outro serviço de email se necessário
          auth: {
            user: process.env.EMAIL_USER, // O email que vai enviar
            pass: process.env.EMAIL_PASS, // A senha ou token do email
          },
          tls: {
            rejectUnauthorized: false, // Permite conexões inseguras (necessário para alguns casos)
          },
        });

        // Envia o email
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER, // Email de envio
          to: process.env.RECEIVE_EMAIL, // Email de destino
          subject: 'Nova mensagem do chat', // Assunto do email
          text: `Mensagem: ${message}\nEmail do usuário: ${email}`, // Corpo do email
          replyTo: email, // Define o email do cliente como destinatário de respostas
        });

        console.log('E-mail enviado:', info.response);
        return res.status(200).send('Email enviado com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar email:', error);
        return res.status(500).send('Erro ao enviar email');
      }
    } else {
      // Caso o método da requisição não seja POST
      return res.status(405).send('Método não permitido');
    }
  });
};
