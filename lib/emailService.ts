import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactFormData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email notification');
    return { success: false, error: 'Email service not configured' };
  }

  if (!process.env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not configured, skipping email notification');
    return { success: false, error: 'Admin email not configured' };
  }

  try {
    await resend.emails.send({
      from: 'noreply@freepalestine.com',
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted at: ${new Date().toISOString()}</em></p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

export async function sendAutoReply(data: ContactFormData) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await resend.emails.send({
      from: 'noreply@freepalestine.com',
      to: data.email,
      subject: 'Mesajınızı Aldık - Free Palestine',
      html: `
        <h2>Merhaba ${data.name},</h2>
        <p>Mesajınızı aldık ve en kısa sürede size dönüş yapacağız.</p>
        <p><strong>Konu:</strong> ${data.subject}</p>
        <p>Filistin davasına verdiğiniz destek için teşekkür ederiz.</p>
        <br>
        <p>Saygılarımızla,<br>Free Palestine Ekibi</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return { success: false, error: 'Failed to send auto-reply' };
  }
}

interface NewsletterWelcomeData {
  email: string;
  firstName?: string;
}

export async function sendNewsletterWelcome(data: NewsletterWelcomeData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping newsletter welcome email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const greeting = data.firstName ? `Merhaba ${data.firstName}` : 'Merhaba';
    
    await resend.emails.send({
      from: 'noreply@freepalestine.com',
      to: data.email,
      subject: 'Free Palestine Newsletter\'a Hoş Geldiniz!',
      html: `
        <h2>${greeting},</h2>
        <p>Free Palestine newsletter\'a abone olduğunuz için teşekkür ederiz!</p>
        
        <p>Bundan böyle sizlere düzenli olarak şunları göndereceğiz:</p>
        <ul>
          <li>Filistin'deki son gelişmeler</li>
          <li>Boykot kampanyaları ve haberler</li>
          <li>Dayanışma etkinlikleri</li>
          <li>Yardım fırsatları</li>
        </ul>
        
        <p>Filistin davasına verdiğiniz destek için teşekkür ederiz.</p>
        
        <p><strong>Özgür Filistin!</strong></p>
        
        <br>
        <p>Saygılarımızla,<br>Free Palestine Ekibi</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          Bu e-postayı almak istemiyorsanız, newsletter aboneliğinizi iptal edebilirsiniz.
        </p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error);
    return { success: false, error: 'Failed to send welcome email' };
  }
}