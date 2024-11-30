const nodemailer = require('nodemailer');
const cors = require('cors');

module.exports = async (req, res) => {
  cors({
    origin: 'https://maxdeveloper.vercel.app', // Domínio do frontend
  })(req, res, async () => {
    if (req.method === 'POST') {
      const { email, message } = req.body;

      // Validação de campos obrigatórios
      if (!email || !message) {
        return res.status(400).send('Campos obrigatórios não preenchidos.');
      }

      try {
        // Configuração do transporte com SMTP Gmail
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, // Email do remetente
            pass: process.env.EMAIL_PASS, // Senha do remetente
          },
          tls: {
            rejectUnauthorized: false, // Para conexões seguras
          },
        });

        // Opções de envio de email
        const mailOptions = {
          from: process.env.EMAIL_USER, // Remetente
          to: process.env.RECEIVE_EMAIL, // Destinatário
          subject: 'Nova mensagem do chat',
          text: `Mensagem: ${message}\nEmail do usuário: ${email}`,
          replyTo: email,
        };

        // Envio do email
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.response);
        return res.status(200).send('Email enviado com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar email:', error);
        return res.status(500).send('Erro ao enviar email');
      }
    } else {
      return res.status(405).send('Método não permitido');
    }
  });
};
