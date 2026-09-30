const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

async function sendPasswordResetEmail(to, link) {
  const mailer = getTransporter();
  const mailOptions = {
    from: process.env.MAIL_FROM || 'no-reply@checklist.local',
    to,
    subject: 'Redefinição de senha',
    text: `Você solicitou a redefinição de senha. Acesse o link para criar uma nova senha (válido por 1 hora): ${link}\n\nSe você não solicitou isso, ignore este e-mail.`,
    html: `<p>Você solicitou a redefinição de senha.</p><p><a href="${link}">Clique aqui para criar uma nova senha</a> (o link é válido por 1 hora).</p><p>Se você não solicitou isso, ignore este e-mail.</p>`,
  };

  if (!mailer) {
    console.warn('[mailer] SMTP não configurado. Link de redefinição:', link);
    return;
  }

  await mailer.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
