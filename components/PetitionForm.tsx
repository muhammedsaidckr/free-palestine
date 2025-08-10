'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/components/I18nProvider';

interface PetitionFormData {
  email: string;
  firstName: string;
  lastName: string;
  city: string;
}

interface PetitionFormProps {
  onSignatureSuccess?: (totalCount: number) => void;
  className?: string;
  compact?: boolean;
}

export default function PetitionForm({ onSignatureSuccess, className = '', compact = false }: PetitionFormProps) {
  const [formData, setFormData] = useState<PetitionFormData>({
    email: '',
    firstName: '',
    lastName: '',
    city: ''
  });
  const [totalCount, setTotalCount] = useState<number>(2847);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useI18n();

  // Fetch current petition count on mount
  useEffect(() => {
    const fetchPetitionCount = async () => {
      try {
        const response = await fetch('/api/petition');
        if (response.ok) {
          const data = await response.json();
          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error('Error fetching petition count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetitionCount();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error state when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setErrorMessage(t('petition.errors.emailRequired'));
      return false;
    }

    if (!formData.firstName.trim()) {
      setErrorMessage(t('petition.errors.firstNameRequired'));
      return false;
    }

    if (!formData.lastName.trim()) {
      setErrorMessage(t('petition.errors.lastNameRequired'));
      return false;
    }

    if (formData.firstName.trim().length < 2) {
      setErrorMessage(t('petition.errors.firstNameTooShort'));
      return false;
    }

    if (formData.lastName.trim().length < 2) {
      setErrorMessage(t('petition.errors.lastNameTooShort'));
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t('petition.errors.invalidEmail'));
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
      const response = await fetch('/api/petition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTotalCount(data.totalCount);
        if (onSignatureSuccess) {
          onSignatureSuccess(data.totalCount);
        }
        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          city: ''
        });
      } else {
        setSubmitStatus('error');
        if (response.status === 409) {
          setErrorMessage(t('petition.errors.alreadySigned'));
        } else {
          setErrorMessage(data.error || t('petition.errors.submitFailed'));
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(t('petition.errors.networkError'));
      console.error('Error submitting petition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-3"></div>
          <div className="h-10 bg-gray-300 rounded mb-3"></div>
          <div className="h-10 bg-gray-300 rounded mb-3"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (submitStatus === 'success') {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-green-100 text-green-800 p-6 rounded-lg">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-bold mb-2">{t('petition.success.title')}</h3>
          <p className="mb-4">{t('petition.success.message')}</p>
          <p className="text-sm font-medium mb-4">
            {t('petition.success.totalCount').replace('{count}', totalCount.toLocaleString())}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: t('messages.shareTitle'),
                    text: t('petition.success.shareText'),
                    url: window.location.origin
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  alert(t('messages.linkCopied'));
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors"
            >
              {t('petition.success.shareButton')}
            </button>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="text-[#CE1126] font-medium hover:underline"
            >
              {t('petition.success.signAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600 mb-2">{t('petition.currentCount')}</p>
        <div className="text-2xl font-bold text-[#CE1126]">
          {totalCount.toLocaleString()} {t('petition.signatures')}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!compact && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('petition.title')}</h3>
            <p className="text-gray-600">{t('petition.description')}</p>
          </div>
        )}

        {submitStatus === 'error' && errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('petition.form.firstName')} *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
              placeholder={t('petition.form.firstNamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('petition.form.lastName')} *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
              placeholder={t('petition.form.lastNamePlaceholder')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('petition.form.email')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
            placeholder={t('petition.form.emailPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            {t('petition.form.city')} {t('petition.form.optional')}
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] text-gray-900 placeholder-gray-500"
            placeholder={t('petition.form.cityPlaceholder')}
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
              {t('petition.form.submitting')}
            </>
          ) : (
            t('petition.form.submitButton')
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          {t('petition.form.privacy')}
        </p>
      </form>
    </div>
  );
}
