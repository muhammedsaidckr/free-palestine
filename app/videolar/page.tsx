'use client';

import { useState } from 'react';
import Image from "next/image";
import { useI18n } from "@/components/I18nProvider";
import VideoContent, { VideoItem } from "@/components/VideoContent";
import Link from 'next/link';
import { useEffect } from 'react';

export default function VideosPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
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


  const handleLanguageToggle = (lang: 'tr' | 'en') => {
    setLanguage(lang);
  };

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        setVideosLoading(true);
        const response = await fetch('/api/videos');
        const result = await response.json();
        if (result.success && result.data) {
          setAllVideos(result.data);
        } else {
          console.error('Error fetching videos:', result.error);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchAllVideos();
  }, []);

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
              <Link href="/" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.home')}</Link>
              <Link href="/bilgilendirme" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.information')}</Link>
              <Link href="/haberler" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.news')}</Link>
              <Link href="/eylemler" className="text-gray-700 hover:text-[#CE1126] font-medium">{t('nav.actions')}</Link>
              <Link href="/boykot" className="text-gray-700 hover:text-[#CE1126] font-medium">Boykot</Link>
              <span className="text-[#CE1126] font-medium cursor-default">Videolar</span>
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
              <Link
                href="/"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/bilgilendirme"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.information')}
              </Link>
              <Link
                href="/haberler"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.news')}
              </Link>
              <Link
                href="/eylemler"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                {t('nav.actions')}
              </Link>
              <Link
                href="/boykot"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                Boykot / Boycott
              </Link>
              <span
                className="block w-full text-left px-4 py-3 text-[#CE1126] font-medium border-l-4 border-[#CE1126] bg-gray-50"
              >
                Videolar
              </span>
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
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Video İçerikleri</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Filistin konusunda bilinçlendirici video içerikleri, belgeseller, tanıklıklar ve eğitici materyaller.
            </p>
          </div>
        </div>
      </section>

      {/* Videos Content */}
      {videosLoading ? (
        <div className="py-20 bg-white">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1126] mx-auto mb-4"></div>
            <p className="text-gray-600">Videolar yükleniyor...</p>
          </div>
        </div>
      ) : (
        <VideoContent 
          videos={allVideos}
          title=""
          subtitle=""
          showCategories={true}
          className="bg-white"
        />
      )}

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
                <li><Link href="/" className="hover:text-white">{t('nav.home')}</Link></li>
                <li><Link href="/bilgilendirme" className="hover:text-white">{t('nav.information')}</Link></li>
                <li><Link href="/haberler" className="hover:text-white">{t('nav.news')}</Link></li>
                <li><Link href="/eylemler" className="hover:text-white">{t('nav.actions')}</Link></li>
                <li><span className="text-white">Videolar</span></li>
                <li><Link href="/boykot" className="hover:text-white">Boykot</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('footer.actions')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#petition" className="hover:text-white">{t('footer.petition')}</Link></li>
                <li><Link href="/boykot" className="hover:text-white">{t('footer.boycottList')}</Link></li>
                <li><Link href="/#hareket" className="hover:text-white">{t('footer.awareness')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">{t('footer.contact')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@ozgurfilistin.tr</li>
                <li>@OzgurFilistin</li>
                <li>Türkiye</li>
              </ul>
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
