const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(value) {
  return String(value || '').trim();
}

function buildParticipantEmail({ name, eventName }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2>Credencial recebida com sucesso!</h2>

      <p>Olá, ${sanitize(name)}.</p>

      <p>
        Obrigado. Seus dados foram registrados para o
        <strong>${sanitize(eventName)}</strong>.
      </p>

      <p>
        Em breve, nossa equipe poderá entrar em contato com novas informações
        sobre sua participação.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <p style="font-size: 13px; color: #64748b;">
        Grupo Mídia • GM Connect
      </p>
    </div>
  `;
}

function buildInternalEmail(data) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2>Nova credencial recebida</h2>

      <p><strong>Evento:</strong> ${sanitize(data.eventName)}</p>
      <p><strong>Nome:</strong> ${sanitize(data.name)}</p>
      <p><strong>E-mail:</strong> ${sanitize(data.email)}</p>
      <p><strong>Telefone:</strong> ${sanitize(data.phone)}</p>
      <p><strong>Empresa:</strong> ${sanitize(data.company)}</p>
      <p><strong>Cargo:</strong> ${sanitize(data.role)}</p>
      <p><strong>Segmento:</strong> ${sanitize(data.segment)}</p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

      <p style="font-size: 13px; color: #64748b;">
        Notificação automática enviada pelo GM Connect.
      </p>
    </div>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Método não permitido.'
    });
  }

  try {
    const body = req.body || {};

    const payload = {
      eventName: body.eventName || 'Healthcare Conference 2026',
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      role: body.role,
      segment: body.segment
    };

    if (!payload.email) {
      return res.status(400).json({
        ok: false,
        message: 'E-mail do participante não informado.'
      });
    }

    const from = process.env.NOTIFICATION_FROM || 'GM Connect <onboarding@resend.dev>';
    const internalTo = process.env.NOTIFICATION_TO;

    const emailTasks = [
      resend.emails.send({
        from,
        to: payload.email,
        subject: `Credencial recebida | ${payload.eventName}`,
        html: buildParticipantEmail(payload)
      })
    ];

    if (internalTo) {
      emailTasks.push(
        resend.emails.send({
          from,
          to: internalTo,
          subject: `Nova credencial recebida | ${payload.eventName}`,
          html: buildInternalEmail(payload)
        })
      );
    }

    await Promise.all(emailTasks);

    return res.status(200).json({
      ok: true,
      message: 'Notificações enviadas com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao enviar notificações:', error);

    return res.status(500).json({
      ok: false,
      message: 'Erro ao enviar notificações.'
    });
  }
};