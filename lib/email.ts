import nodemailer from 'nodemailer'

// TODO: Configure with real SMTP credentials in production
// For development, you can use services like:
// - Mailtrap.io (testing)
// - SendGrid
// - AWS SES
// - Gmail (with app-specific password)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // TODO: In development, emails won't actually send unless SMTP is configured
  // Consider using a service like Resend, SendGrid, or AWS SES in production
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 Email would be sent to:', to)
    console.log('Subject:', subject)
    console.log('Content:', text || 'HTML email')
    return { success: true, message: 'Email logged (SMTP not configured)' }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Naova" <noreply@naova.com>',
      to,
      subject,
      text,
      html,
    })

    console.log('✅ Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email send error:', error)
    return { success: false, error }
  }
}

// Template: Welcome email for new client
export async function sendWelcomeEmail(
  to: string,
  name: string,
  temporaryPassword: string
) {
  const subject = 'Bienvenido a Naova - Tu cuenta ha sido creada'
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #685BC7; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { background: #685BC7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .credentials { background: white; padding: 15px; border-left: 4px solid #685BC7; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenido a Naova</h1>
          </div>
          <div class="content">
            <p>Hola ${name},</p>
            <p>Tu cuenta en Naova ha sido creada exitosamente. Ahora puedes acceder a nuestra plataforma de compras industriales.</p>
            
            <div class="credentials">
              <strong>Tus credenciales de acceso:</strong><br>
              <strong>Email:</strong> ${to}<br>
              <strong>Contraseña temporal:</strong> ${temporaryPassword}
            </div>
            
            <p><strong>⚠️ Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña en tu primer inicio de sesión.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Iniciar Sesión</a>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Saludos,<br>El equipo de Naova</p>
          </div>
          <div class="footer">
            <p>© 2024 Naova. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Template: Contact form notification to sales
export async function sendContactLeadEmail(leadData: {
  name: string
  company?: string
  email: string
  phone?: string
  planInterest?: string
  message?: string
}) {
  const subject = `Nuevo lead: ${leadData.name} - ${leadData.planInterest || 'Sin plan especificado'}`
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #685BC7; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #685BC7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 Nuevo Lead de Contacto</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nombre:</div>
              <div>${leadData.name}</div>
            </div>
            ${leadData.company ? `
              <div class="field">
                <div class="label">Empresa:</div>
                <div>${leadData.company}</div>
              </div>
            ` : ''}
            <div class="field">
              <div class="label">Email:</div>
              <div><a href="mailto:${leadData.email}">${leadData.email}</a></div>
            </div>
            ${leadData.phone ? `
              <div class="field">
                <div class="label">Teléfono:</div>
                <div>${leadData.phone}</div>
              </div>
            ` : ''}
            ${leadData.planInterest ? `
              <div class="field">
                <div class="label">Plan de interés:</div>
                <div><strong>${leadData.planInterest}</strong></div>
              </div>
            ` : ''}
            ${leadData.message ? `
              <div class="field">
                <div class="label">Mensaje:</div>
                <div>${leadData.message}</div>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
    </html>
  `

  const salesEmail = process.env.SALES_EMAIL || 'ventas@naova.com'
  return sendEmail({ to: salesEmail, subject, html })
}

// Template: Requirement submitted notification
export async function sendRequirementNotification(
  adminEmail: string,
  clientName: string,
  requirementTitle: string
) {
  const subject = `Nuevo requerimiento: ${requirementTitle}`
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <h2>Nuevo Requerimiento Enviado</h2>
        <p><strong>Cliente:</strong> ${clientName}</p>
        <p><strong>Requerimiento:</strong> ${requirementTitle}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/requirements">Ver en el dashboard</a></p>
      </body>
    </html>
  `

  return sendEmail({ to: adminEmail, subject, html })
}

