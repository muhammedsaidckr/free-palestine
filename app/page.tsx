'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Timeline } from "@/components/Timeline";
import { newsService, NewsItem } from "@/lib/newsService";
import PetitionForm from "@/components/PetitionForm";
import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";
import { LazySection } from "@/components/LazySection";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const { language, setLanguage, t } = useI18n();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      scrollToSection(href);
    }
  };

  const handleLanguageToggle = (lang: 'tr' | 'en') => {
    setLanguage(lang);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('messages.shareTitle'),
        text: t('messages.shareText'),
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert(t('messages.linkCopied')))
        .catch(() => alert(t('messages.linkCopyFailed')));
    }
  };

  const scrollToPetition = () => {
    const element = document.getElementById('petition');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  useEffect(() => {
    const fetchHomePageNews = async () => {
      try {
        setNewsLoading(true);
        const news = await newsService.getAllNews();
        // Get first 6 items for homepage
        setNewsItems(news.slice(0, 6));
      } catch (error) {
        console.error('Error fetching homepage news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchHomePageNews();
  }, []);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'palestine': return 'text-red-600';
      case 'international': return 'text-blue-600';
      case 'turkey': return 'text-orange-600';
      case 'solidarity': return 'text-green-600';
      case 'humanrights': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'palestine': return 'Filistin';
      case 'international': return 'Uluslararası';
      case 'turkey': return 'Türkiye';
      case 'solidarity': return 'Dayanışma';
      case 'humanrights': return 'İnsan Hakları';
      default: return 'Genel';
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b-2 border-[#CE1126]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Palestinian Flag"
                  width={32}
                  height={20}
                  className="border border-gray-300"
                  priority
                />
                <span className="text-xl font-bold text-gray-900">Özgür Filistin</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => handleNavigation('#')} className="text-gray-900 hover:text-[#CE1126] font-medium cursor-pointer">{t('nav.home')}</button>
              <a href="/bilgilendirme" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.information')}</a>
              <a href="/haberler" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.news')}</a>
              <a href="/eylemler" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.actions')}</a>
              <a href="/boykot" className="text-gray-700 hover:text-[#CE1126] font-medium">Boykot</a>
              <button onClick={() => scrollToSection('iletisim')} className="text-gray-700 hover:text-[#CE1126] font-medium cursor-pointer">{t('nav.contact')}</button>
            </nav>
            
            {/* Desktop Language Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle - hidden on mobile */}
              <div className="hidden sm:flex space-x-2">
                <button 
                  onClick={() => handleLanguageToggle('tr')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    language === 'tr' 
                      ? 'bg-[#CE1126] text-white' 
                      : 'text-gray-600 hover:text-[#CE1126]'
                  }`}
                >
                  TR
                </button>
                <button 
                  onClick={() => handleLanguageToggle('en')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    language === 'en' 
                      ? 'bg-[#CE1126] text-white' 
                      : 'text-gray-600 hover:text-[#CE1126]'
                  }`}
                >
                  EN
                </button>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
                aria-label="Menu"
              >
                <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={closeMobileMenu}></div>
          
          {/* Menu Panel */}
          <div className={`absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Palestinian Flag"
                  width={24}
                  height={15}
                  className="border border-gray-300"
                  loading="lazy"
                />
                <span className="font-bold text-gray-900">Özgür Filistin</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Menu Items */}
            <nav className="py-4">
              <button
                onClick={() => handleNavigation('#')}
                className="block w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-[#CE1126]"
              >
                {t('nav.home')}
              </button>
              <a
                href="/bilgilendirme"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.information')}
              </a>
              <a
                href="/haberler"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.news')}
              </a>
              <a
                href="/eylemler"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.actions')}
              </a>
              <a
                href="/boykot"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                Boykot / Boycott
              </a>
              <button
                onClick={() => scrollToSection('iletisim')}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
              >
                {t('nav.contact')}
              </button>
            </nav>
            
            {/* Language Toggle in Mobile Menu */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleLanguageToggle('tr')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    language === 'tr'
                      ? 'bg-[#CE1126] text-white'
                      : 'text-gray-600 border border-gray-300 hover:border-[#CE1126] hover:text-[#CE1126]'
                  }`}
                >
                  TR
                </button>
                <button 
                  onClick={() => handleLanguageToggle('en')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    language === 'en'
                      ? 'bg-[#CE1126] text-white'
                      : 'text-gray-600 border border-gray-300 hover:border-[#CE1126] hover:text-[#CE1126]'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="px-4 py-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">{t('footer.follow')}</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://instagram.com/ozgurfilistin', '_blank')}
                  className="text-gray-400 hover:text-[#CE1126] transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com/ozgurfilistin', '_blank')}
                  className="text-gray-400 hover:text-[#CE1126] transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.open('https://wa.me/+905555555555', '_blank')}
                  className="text-gray-400 hover:text-[#CE1126] transition-colors"
                >
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Palestinian solidarity demonstration"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t('hero.title')} <span className="text-[#CE1126]">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
            {t('hero.description')}
          </p>
          <p className="text-lg text-white mb-8 max-w-4xl mx-auto drop-shadow-md italic font-medium">
            {t('hero.inspirationalMessage')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('hareket')}
              className="bg-[#CE1126] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B00E20] transition-colors shadow-lg"
            >
              {t('hero.actionButton')}
            </button>
            <button 
              onClick={() => scrollToSection('bilgi')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#CE1126] transition-colors shadow-lg"
            >
              {t('hero.infoButton')}
            </button>
          </div>
        </div>
      </section>

      {/* Current Situation Section */}
      <section id="bilgi" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('situation.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('situation.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">58,573+</div>
              <div className="text-gray-600">{t('situation.casualties')}</div>
              <div className="text-xs text-gray-500 mt-1">{t('situation.date')}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">139,607+</div>
              <div className="text-gray-600">{t('situation.injured')}</div>
              <div className="text-xs text-gray-500 mt-1">{t('situation.date')}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">90%</div>
              <div className="text-gray-600">{t('situation.displaced')}</div>
              <div className="text-xs text-gray-500 mt-1">{t('situation.displacedLocation')}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">45,000</div>
              <div className="text-gray-600">{t('situation.aid')}</div>
              <div className="text-xs text-gray-500 mt-1">{t('situation.aidFrom')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Timeline */}
      <LazySection>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('history.title')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('history.subtitle')}
              </p>
            </div>
            
            <Timeline />
          </div>
        </section>
      </LazySection>

      {/* Action Section */}
      <section id="hareket" className="py-20 bg-[#CE1126] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('action.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto">
              {t('action.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{t('action.awareness.title')}</h3>
              <p className="mb-4">{t('action.awareness.description')}</p>
              <button 
                onClick={handleShare}
                className="bg-white text-[#CE1126] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                {t('action.awareness.button')}
              </button>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{t('action.petition.title')}</h3>
              <p className="mb-4">{t('action.petition.description')}</p>
              <button 
                onClick={scrollToPetition}
                className="bg-white text-[#CE1126] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                {t('action.petition.button')}
              </button>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{t('action.boycott.title')}</h3>
              <p className="mb-4">{t('action.boycott.description')}</p>
              <a 
                href="/boykot"
                className="bg-white text-[#CE1126] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors inline-block text-center"
              >
                {t('action.boycott.button')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <LazySection>
        <section id="haberler" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('news.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('news.subtitle')}
            </p>
          </div>
          
          {newsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1126] mx-auto mb-4"></div>
              <p className="text-gray-600">Haberler yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((news) => (
                <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className={`text-sm font-medium mb-2 ${getCategoryBadgeColor(news.category)}`}>
                      {getCategoryLabel(news.category)}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{news.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{news.source}</span>
                      <span>{news.timeAgo}</span>
                    </div>
                    {news.url && (
                      <div className="mt-3">
                        <a 
                          href={news.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#CE1126] text-sm font-medium hover:text-[#B00E20] transition-colors"
                        >
                          Devamını oku →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <a 
              href="/haberler"
              className="bg-[#CE1126] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B00E20] transition-colors inline-block"
            >
              Tüm Haberleri Gör
            </a>
          </div>
        </div>
        </section>
      </LazySection>

      {/* Petition Section */}
      <section id="petition" className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('petition.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('petition.description')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <PetitionForm />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#CE1126]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('newsletter.title')}</h2>
            <p className="text-lg text-red-100 max-w-2xl mx-auto">
              {t('newsletter.description')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('contact.description')}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg shadow-lg p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="iletisim" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.svg"
                  alt="Palestinian Flag"
                  width={32}
                  height={20}
                  className="border border-gray-600"
                  loading="lazy"
                />
                <span className="text-xl font-bold">Özgür Filistin</span>
              </div>
              <p className="text-gray-400">{t('footer.description')}</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigation('#')} className="hover:text-white text-left">{t('nav.home')}</button></li>
                <li><a href="/bilgilendirme" className="hover:text-white text-left block">{t('nav.information')}</a></li>
                <li><a href="/haberler" className="hover:text-white text-left block">{t('nav.news')}</a></li>
                <li><a href="/eylemler" className="hover:text-white text-left block">{t('nav.actions')}</a></li>
                <li><button onClick={() => scrollToSection('iletisim')} className="hover:text-white text-left">{t('nav.contact')}</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('footer.actions')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={scrollToPetition} className="hover:text-white text-left">{t('footer.petition')}</button></li>
                <li><a href="/boykot" className="hover:text-white text-left block">{t('footer.boycottList')}</a></li>
                <li><button onClick={handleShare} className="hover:text-white text-left">{t('footer.awareness')}</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-gray-400 mb-4">
                <li>info@ozgurfilistin.tr</li>
                <li>@OzgurFilistin</li>
                <li>Türkiye</li>
              </ul>
              <div className="mt-4">
                <h4 className="font-medium text-white mb-2">{t('newsletter.title')}</h4>
                <NewsletterForm inline className="max-w-sm" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.madeWith')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
