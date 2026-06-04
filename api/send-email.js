export default async function handler(req, res) {
  // Manejo del método POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    const { name, email, subject, message, consent } = req.body;

    // Validar consentimiento y campos obligatorios
    if (!consent) {
      return res.status(400).json({ error: 'Debe aceptar los términos de consentimiento legal.' });
    }
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Faltan campos requeridos (nombre, email y mensaje).' });
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
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Nuevo mensaje desde el formulario web</h2>
              <p>Ha recibido una nueva solicitud de información a través del formulario de la página web:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; width: 150px; background-color: #f8fafc; border: 1px solid #e2e8f0;">Nombre:</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f8fafc; border: 1px solid #e2e8f0;">Email:</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; background-color: #f8fafc; border: 1px solid #e2e8f0;">Asunto / Partido:</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0;">${subject || 'No especificado'}</td>
                </tr>
              </table>
              <h3 style="color: #1e293b; margin-top: 20px;">Mensaje / Requerimiento:</h3>
              <div style="padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; white-space: pre-wrap;">${message}</div>
              <footer style="margin-top: 30px; font-size: 0.8em; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                Este correo fue enviado automáticamente desde el formulario de contacto del Procurador Tomás.
              </footer>
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
