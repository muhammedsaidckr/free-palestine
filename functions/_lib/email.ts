// Email service for Cloudflare Workers using Resend
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface NewsletterWelcomeData {
  email: string;
  firstName?: string;
}

interface EmailResult {
  success: boolean;
  message: string;
  error?: string;
  id?: string;
}

// Email templates
function getContactNotificationTemplate(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Yeni İletişim Formu Mesajı</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c5530; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2c5530; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
          .message-box { background: white; border: 1px solid #ddd; border-radius: 5px; padding: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🇵🇸 Yeni İletişim Mesajı</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">İsim:</div>
              <div class="value">${sanitizeHtml(data.name)}</div>
            </div>
            <div class="field">
              <div class="label">E-posta:</div>
              <div class="value">${sanitizeHtml(data.email)}</div>
            </div>
            <div class="field">
              <div class="label">Konu:</div>
              <div class="value">${sanitizeHtml(data.subject)}</div>
            </div>
            <div class="field">
              <div class="label">Mesaj:</div>
              <div class="message-box">${sanitizeHtml(data.message).replace(/\n/g, '<br>')}</div>
            </div>
            <p><small>Gönderim zamanı: ${new Date().toLocaleString('tr-TR')}</small></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getAutoReplyTemplate(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Mesajınızı Aldık</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c5530; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .flag { font-size: 24px; }
          .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="flag">🇵🇸</span>
            <h1>Teşekkür Ederiz</h1>
          </div>
          <div class="content">
            <p>Merhaba ${sanitizeHtml(data.name)},</p>
            
            <p>Mesajınız başarıyla alındı. Filistin halkına destek verdiğiniz için teşekkür ederiz.</p>
            
            <p>"<strong>${sanitizeHtml(data.subject)}</strong>" konulu mesajınızı aldık ve en kısa sürede size dönüş yapacağız.</p>
            
            <p>Filistin'e özgürlük mücadelesindeki desteğiniz çok değerli. Birlikte daha güçlüyüz.</p>
            
            <p>Selam ve dayanışmayla,<br>Özgür Filistin Ekibi</p>
            
            <div class="signature">
              <p><small>Bu mesaj otomatik olarak gönderilmiştir. Lütfen bu e-postaya yanıt vermeyin.</small></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getNewsletterWelcomeTemplate(data: NewsletterWelcomeData): string {
  const name = data.firstName || 'Dostumuz';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Bültene Hoş Geldiniz</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c5530; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .flag { font-size: 32px; margin-bottom: 10px; }
          .welcome-box { background: #f0f8f0; border-left: 4px solid #2c5530; padding: 20px; margin: 20px 0; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="flag">🇵🇸</div>
            <h1>Özgür Filistin Bülteni</h1>
          </div>
          <div class="content">
            <h2>Hoş geldiniz, ${sanitizeHtml(name)}!</h2>
            
            <div class="welcome-box">
              <p><strong>Özgür Filistin bültenimize katıldığınız için teşekkür ederiz!</strong></p>
            </div>
            
            <p>Artık Filistin halkının mücadelesi hakkında güncel haberler, etkinlik duyuruları ve nasıl destek olabileceğinize dair bilgiler alacaksınız.</p>
            
            <p>Bu bülten aracılığıyla:</p>
            <ul>
              <li>📰 Filistin'den güncel haberler</li>
              <li>📅 Dayanışma etkinlikleri</li>
              <li>💪 Nasıl yardım edebileceğiniz</li>
              <li>📚 Eğitici içerikler</li>
              <li>🤝 Topluluk güncellemeleri</li>
            </ul>
            
            <p>Filistin halkının özgürlük mücadelesinde yanında olduğunuz için teşekkür ederiz. Birlikte daha güçlüyüz!</p>
            
            <p>Selam ve dayanışmayla,<br><strong>Özgür Filistin Ekibi</strong></p>
          </div>
          <div class="footer">
            <p>Bu e-postayı almak istemiyorsanız, <a href="#">abonelikten çıkabilirsiniz</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Initialize Resend client
function getResendClient(apiKey: string | undefined): Resend | null {
  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is not set');
    return null;
  }
  return new Resend(apiKey);
}

export async function sendContactNotification(env: Record<string, string | undefined>, data: ContactFormData): Promise<EmailResult> {
  const resend = getResendClient(env.RESEND_API_KEY);
  
  if (!resend) {
    return {
      success: false,
      message: 'Email service not configured',
      error: 'Missing RESEND_API_KEY'
    };
  }

  const fromEmail = env.FROM_EMAIL || 'noreply@freepalestine.org';
  const toEmail = env.ADMIN_EMAIL || 'admin@freepalestine.org';
  
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `🇵🇸 Yeni İletişim: ${data.subject}`,
      html: getContactNotificationTemplate(data),
      replyTo: data.email
    });

    console.log('Contact notification sent successfully:', { id: result.data?.id });
    
    return {
      success: true,
      message: 'Contact notification sent successfully',
      id: result.data?.id
    };
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    return {
      success: false,
      message: 'Failed to send contact notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendAutoReply(env: Record<string, string | undefined>, data: ContactFormData): Promise<EmailResult> {
  const resend = getResendClient(env.RESEND_API_KEY);
  
  if (!resend) {
    return {
      success: false,
      message: 'Email service not configured',
      error: 'Missing RESEND_API_KEY'
    };
  }

  const fromEmail = env.FROM_EMAIL || 'noreply@freepalestine.org';
  
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: '🇵🇸 Mesajınızı Aldık - Teşekkürler',
      html: getAutoReplyTemplate(data)
    });

    console.log('Auto-reply sent successfully:', { id: result.data?.id, to: data.email });
    
    return {
      success: true,
      message: 'Auto-reply sent successfully',
      id: result.data?.id
    };
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return {
      success: false,
      message: 'Failed to send auto-reply',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendNewsletterWelcome(env: Record<string, string | undefined>, data: NewsletterWelcomeData): Promise<EmailResult> {
  const resend = getResendClient(env.RESEND_API_KEY);
  
  if (!resend) {
    return {
      success: false,
      message: 'Email service not configured',
      error: 'Missing RESEND_API_KEY'
    };
  }

  const fromEmail = env.FROM_EMAIL || 'noreply@freepalestine.org';
  
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: '🇵🇸 Özgür Filistin Bültenine Hoş Geldiniz!',
      html: getNewsletterWelcomeTemplate(data)
    });

    console.log('Newsletter welcome sent successfully:', { id: result.data?.id, to: data.email });
    
    return {
      success: true,
      message: 'Newsletter welcome sent successfully',
      id: result.data?.id
    };
  } catch (error) {
    console.error('Failed to send newsletter welcome:', error);
    return {
      success: false,
      message: 'Failed to send newsletter welcome',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '').substring(0, 1000);
}

function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function validateContactData(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!data.subject || data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters long');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (data.subject && data.subject.length > 200) {
    errors.push('Subject must be less than 200 characters');
  }
  
  if (data.message && data.message.length > 5000) {
    errors.push('Message must be less than 5000 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateNewsletterData(data: NewsletterWelcomeData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (data.firstName && (data.firstName.length < 1 || data.firstName.length > 50)) {
    errors.push('First name must be between 1-50 characters if provided');
  }
  
  return { valid: errors.length === 0, errors };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export async function checkRateLimit(
  env: Record<string, string | undefined>,
  identifier: string,
  limit: number = 5,
  windowMs: number = 900000 // 15 minutes
): Promise<RateLimitResult> {
  try {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // In a real implementation, you'd use Cloudflare KV or Durable Objects
    // For now, we'll allow all requests but log the attempt
    console.log('Rate limit check:', { identifier, key, now, windowStart });
    
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow the request if rate limiting fails
    return {
      allowed: true,
      remaining: 0,
      resetTime: Date.now() + windowMs
    };
  }
}

export function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  
  // Cloudflare's connecting IP is most reliable
  if (cfConnectingIP && cfConnectingIP !== '0.0.0.0') {
    return cfConnectingIP;
  }
  
  // Parse X-Forwarded-For header (format: client, proxy1, proxy2)
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    const clientIP = ips.find(ip => 
      ip && 
      ip !== '0.0.0.0' && 
      !ip.startsWith('127.') && 
      !ip.startsWith('10.') && 
      !ip.startsWith('192.168.') &&
      !ip.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)
    );
    if (clientIP) return clientIP;
  }
  
  if (xRealIP && xRealIP !== '0.0.0.0') {
    return xRealIP;
  }
  
  return 'unknown';
}