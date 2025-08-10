'use client';

import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  className?: string;
  compact?: boolean;
}

export default function ContactForm({ className = '', compact = false }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useI18n();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage(t('contact.errors.nameRequired'));
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage(t('contact.errors.emailRequired'));
      return false;
    }

    if (!formData.subject.trim()) {
      setErrorMessage(t('contact.errors.subjectRequired'));
      return false;
    }

    if (!formData.message.trim()) {
      setErrorMessage(t('contact.errors.messageRequired'));
      return false;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage(t('contact.errors.nameTooShort'));
      return false;
    }

    if (formData.subject.trim().length < 5) {
      setErrorMessage(t('contact.errors.subjectTooShort'));
      return false;
    }

    if (formData.message.trim().length < 10) {
      setErrorMessage(t('contact.errors.messageTooShort'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t('contact.errors.invalidEmail'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || t('contact.errors.submitFailed'));
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(t('contact.errors.networkError'));
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-green-100 text-green-800 p-6 rounded-lg">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-bold mb-2">{t('contact.success.title')}</h3>
          <p className="mb-4">{t('contact.success.message')}</p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="bg-[#CE1126] text-white px-4 py-2 rounded font-medium hover:bg-[#B00E20] transition-colors"
          >
            {t('contact.success.sendAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!compact && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.title')}</h3>
            <p className="text-gray-600">{t('contact.description')}</p>
          </div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.form.name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
              placeholder={t('contact.form.namePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.form.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
              placeholder={t('contact.form.emailPlaceholder')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            {t('contact.form.subject')} *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
            placeholder={t('contact.form.subjectPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {t('contact.form.message')} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500 resize-vertical"
            placeholder={t('contact.form.messagePlaceholder')}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#CE1126] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#B00E20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('contact.form.submitting')}
            </>
          ) : (
            t('contact.form.submitButton')
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          {t('contact.form.privacy')}
        </p>
      </form>
    </div>
  );
}