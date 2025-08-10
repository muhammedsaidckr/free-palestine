'use client';

import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';

interface NewsletterFormData {
  email: string;
  firstName?: string;
  interests?: string[];
}

interface NewsletterFormProps {
  className?: string;
  compact?: boolean;
  inline?: boolean;
}

export default function NewsletterForm({ className = '', compact = false, inline = false }: NewsletterFormProps) {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    firstName: '',
    interests: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useI18n();

  const interestOptions = [
    { id: 'news', label: t('newsletter.interests.news') },
    { id: 'actions', label: t('newsletter.interests.actions') },
    { id: 'events', label: t('newsletter.interests.events') },
    { id: 'updates', label: t('newsletter.interests.updates') }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleInterestChange = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...(prev.interests || []), interestId]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setErrorMessage(t('newsletter.errors.emailRequired'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t('newsletter.errors.invalidEmail'));
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
      const response = await fetch('/api/newsletter', {
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
          email: '',
          firstName: '',
          interests: []
        });
      } else {
        setSubmitStatus('error');
        if (response.status === 409) {
          setErrorMessage(t('newsletter.errors.alreadySubscribed'));
        } else {
          setErrorMessage(data.error || t('newsletter.errors.submitFailed'));
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(t('newsletter.errors.networkError'));
      console.error('Error submitting newsletter form:', error);
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
          <h3 className="text-lg font-bold mb-2">{t('newsletter.success.title')}</h3>
          <p className="mb-4">{t('newsletter.success.message')}</p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="text-[#CE1126] font-medium hover:underline"
          >
            {t('newsletter.success.subscribeAnother')}
          </button>
        </div>
      </div>
    );
  }

  if (inline) {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          {submitStatus === 'error' && errorMessage && (
            <div className="sm:col-span-2 bg-red-100 text-red-800 p-2 rounded text-sm">
              {errorMessage}
            </div>
          )}
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="flex-1 px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500 text-sm"
            placeholder={t('newsletter.form.emailPlaceholder')}
          />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#CE1126] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#B00E20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          >
            {isSubmitting ? t('newsletter.form.submitting') : t('newsletter.form.submitButton')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!compact && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('newsletter.title')}</h3>
            <p className="text-gray-600">{t('newsletter.description')}</p>
          </div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className={compact ? 'space-y-3' : 'space-y-4'}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('newsletter.form.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
              placeholder={t('newsletter.form.emailPlaceholder')}
            />
          </div>

          {!compact && (
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('newsletter.form.firstName')} {t('newsletter.form.optional')}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
                placeholder={t('newsletter.form.firstNamePlaceholder')}
              />
            </div>
          )}

          {!compact && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('newsletter.form.interests')} {t('newsletter.form.optional')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {interestOptions.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.interests?.includes(option.id) || false}
                      onChange={() => handleInterestChange(option.id)}
                      className="rounded text-[#CE1126] focus:ring-[#CE1126] focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
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
              {t('newsletter.form.submitting')}
            </>
          ) : (
            t('newsletter.form.submitButton')
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          {t('newsletter.form.privacy')}
        </p>
      </form>
    </div>
  );
}