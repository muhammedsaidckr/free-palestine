// Simple email service for Cloudflare Workers (without Resend dependency)
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

export async function sendContactNotification(env: any, data: ContactFormData) {
  // For now, just log the contact submission
  // In production, you could use Cloudflare's Email API, SendGrid, or another service
  console.log('Contact form submission:', {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message.substring(0, 100) + '...',
    timestamp: new Date().toISOString()
  });
  
  return { success: true, message: 'Contact notification logged' };
}

export async function sendAutoReply(env: any, data: ContactFormData) {
  // For now, just log the auto-reply
  console.log('Auto-reply would be sent to:', data.email);
  
  return { success: true, message: 'Auto-reply logged' };
}

export async function sendNewsletterWelcome(env: any, data: NewsletterWelcomeData) {
  // For now, just log the welcome email
  console.log('Newsletter welcome would be sent to:', data.email, 'Name:', data.firstName);
  
  return { success: true, message: 'Newsletter welcome logged' };
}

// Helper functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function getClientIP(request: Request): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  return 'unknown';
}