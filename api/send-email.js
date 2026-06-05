/**
 * Escapa caracteres especiales de HTML para prevenir inyecciones XSS.
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Manejo del método POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    const { name, email, subject, message, consent, website } = req.body;

    // Honeypot anti-bot: si el campo oculto tiene valor, es un bot
    if (website) {
      // Respuesta falsa de éxito para no alertar al bot
      return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
    }

    // Versiones sanitizadas para uso dentro de la plantilla HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // Validar consentimiento y campos obligatorios
    if (!consent) {
      return res.status(400).json({ error: 'Debe aceptar los términos de consentimiento legal.' });
    }
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos requeridos (nombre, email y mensaje).' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;
    const toEmail = process.env.TO_EMAIL;

    // Validar que las variables de entorno están configuradas en Vercel
    if (!apiKey || !senderEmail || !toEmail) {
      console.error('Error de configuración: Faltan variables de entorno (BREVO_API_KEY, SENDER_EMAIL, TO_EMAIL).');
      return res.status(500).json({ error: 'El servidor no está configurado correctamente para enviar correos.' });
    }

    // Estructurar el envío a la API de Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: name,
          email: senderEmail
        },
        to: [{
          email: toEmail,
          name: 'Procurador Tomás'
        }],
        replyTo: {
          email: email,
          name: name
        },
        subject: `Nuevo contacto web: ${subject || 'Sin Asunto'}`,
        htmlContent: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo contacto - Procurador Tomás</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;">

          <!-- ===== HEADER ===== -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); border-radius: 16px 16px 0 0; padding: 36px 40px; text-align: center;">
              <!-- Gold top line -->
              <div style="width: 48px; height: 3px; background-color: #c5a880; margin: 0 auto 20px auto; border-radius: 2px;"></div>
              <!-- Title -->
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #c5a880; letter-spacing: 3px; text-transform: uppercase;">Despacho Procesal</p>
              <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Gabriel Tomás</h1>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 400;">Procurador de los Tribunales · Palma de Mallorca</p>
              <!-- Gold bottom line -->
              <div style="width: 48px; height: 1px; background-color: #c5a880; margin: 20px auto 0 auto; opacity: 0.4;"></div>
            </td>
          </tr>

          <!-- ===== NOTIFICATION BANNER ===== -->
          <tr>
            <td style="background-color: #1e40af; padding: 14px 40px; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #ffffff; letter-spacing: 0.3px;">
                📩 &nbsp;Nueva solicitud recibida desde el formulario web
              </p>
            </td>
          </tr>

          <!-- ===== BODY ===== -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px 40px 32px 40px;">

              <p style="margin: 0 0 28px 0; font-size: 14px; color: #64748b; line-height: 1.7;">
                Ha recibido una nueva solicitud de información a través del formulario de contacto de su página web. A continuación encontrará todos los detalles proporcionados por el interesado:
              </p>

              <!-- ── DATOS DEL REMITENTE ── -->
              <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 700; color: #c5a880; letter-spacing: 2.5px; text-transform: uppercase;">Datos del Remitente</p>

              <!-- Nombre -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                <tr>
                  <td width="140" style="padding: 12px 16px; background-color: #f8fafc; border-right: 1px solid #e2e8f0;">
                    <p style="margin:0; font-size: 11px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</p>
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff;">
                    <p style="margin:0; font-size: 14px; color: #1e293b; font-weight: 500;">${safeName}</p>
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                <tr>
                  <td width="140" style="padding: 12px 16px; background-color: #f8fafc; border-right: 1px solid #e2e8f0;">
                    <p style="margin:0; font-size: 11px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff;">
                    <a href="mailto:${safeEmail}" style="font-size: 14px; color: #1e40af; font-weight: 500; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
              </table>

              <!-- Asunto -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                <tr>
                  <td width="140" style="padding: 12px 16px; background-color: #f8fafc; border-right: 1px solid #e2e8f0;">
                    <p style="margin:0; font-size: 11px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Asunto</p>
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff;">
                    <p style="margin:0; font-size: 14px; color: #1e293b; font-weight: 500;">${safeSubject || '<em style="color:#94a3b8;">No especificado</em>'}</p>
                  </td>
                </tr>
              </table>

              <!-- ── MENSAJE ── -->
              <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: 700; color: #c5a880; letter-spacing: 2.5px; text-transform: uppercase;">Mensaje / Requerimiento</p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #1e40af; border-radius: 0 8px 8px 0; padding: 20px 20px; font-size: 14px; color: #334155; line-height: 1.8; white-space: pre-wrap;">${safeMessage}</div>

              <!-- ── CTA Responder ── -->
              <div style="margin-top: 32px; text-align: center;">
                <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject || 'Consulta desde la web')}" style="display: inline-block; background-color: #1e40af; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 13px 32px; border-radius: 8px; letter-spacing: 0.3px;">
                  ✉️ &nbsp;Responder a ${safeName}
                </a>
              </div>

            </td>
          </tr>

          <!-- ===== DIVIDER ===== -->
          <tr>
            <td style="background-color: #ffffff; padding: 0 40px;">
              <div style="height: 1px; background-color: #e2e8f0;"></div>
            </td>
          </tr>

          <!-- ===== FOOTER ===== -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 24px 40px 32px 40px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #0f172a;">Gabriel Tomás · Procurador de los Tribunales</p>
              <p style="margin: 0 0 12px 0; font-size: 11px; color: #94a3b8;">Colegiado nº 120 ICPIB · Palma de Mallorca, Islas Baleares</p>
              <p style="margin: 0; font-size: 10px; color: #cbd5e1; line-height: 1.6;">
                Este mensaje fue generado automáticamente desde el formulario de contacto de la web.<br>
                Por favor, no responda directamente a este correo — utilice el botón de respuesta de arriba.
              </p>
            </td>
          </tr>

          <!-- ===== BOTTOM PADDING ===== -->
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <p style="margin: 0; font-size: 10px; color: #94a3b8;">© ${new Date().getFullYear()} Procurador Gabriel Tomás · Palma de Mallorca</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
        `
      })
    });

    if (brevoResponse.ok) {
      return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
    } else {
      const errorData = await brevoResponse.json();
      console.error('Error de la API de Brevo:', errorData);
      return res.status(502).json({ error: 'Brevo rechazó el envío de correo.' });
    }

  } catch (error) {
    console.error('Error al procesar el envío de correo:', error);
    return res.status(500).json({ error: 'Ocurrió un error interno del servidor.' });
  }
}
