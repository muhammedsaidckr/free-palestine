'use client';

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('TR');

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

  const handleLanguageToggle = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Özgür Filistin - Free Palestine Türkiye',
        text: 'Filistin için birlikte duralım. Türkiye\'den Filistin\'e destek.',
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link kopyalandı!'))
        .catch(() => alert('Link kopyalanamadı'));
    }
  };

  const handlePetition = () => {
    alert('Dilekçe imzalama özelliği yakında aktif olacak!');
  };

  const handleBoycottList = () => {
    alert('Boykot listesi yakında yayınlanacak!');
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
                />
                <span className="text-xl font-bold text-gray-900">Özgür Filistin</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => handleNavigation('#')} className="text-gray-900 hover:text-[#CE1126] font-medium cursor-pointer">Ana Sayfa</button>
              <a href="/bilgilendirme" className="text-gray-700 hover:text-[#CE1126] font-medium">Bilgilendirme</a>
              <a href="/haberler" className="text-gray-700 hover:text-[#CE1126] font-medium">Haberler</a>
              <a href="/eylemler" className="text-gray-700 hover:text-[#CE1126] font-medium">Eylemler</a>
              <button onClick={() => scrollToSection('iletisim')} className="text-gray-700 hover:text-[#CE1126] font-medium cursor-pointer">İletişim</button>
            </nav>
            
            {/* Desktop Language Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle - hidden on mobile */}
              <div className="hidden sm:flex space-x-2">
                <button 
                  onClick={() => handleLanguageToggle('TR')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    currentLanguage === 'TR' 
                      ? 'bg-[#CE1126] text-white' 
                      : 'text-gray-600 hover:text-[#CE1126]'
                  }`}
                >
                  TR
                </button>
                <button 
                  onClick={() => handleLanguageToggle('EN')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    currentLanguage === 'EN' 
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
                Ana Sayfa
              </button>
              <a
                href="/bilgilendirme"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                Bilgilendirme
              </a>
              <a
                href="/haberler"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                Haberler
              </a>
              <a
                href="/eylemler"
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
                onClick={closeMobileMenu}
              >
                Eylemler
              </a>
              <button
                onClick={() => scrollToSection('iletisim')}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#CE1126] font-medium border-l-4 border-transparent hover:border-[#CE1126]"
              >
                İletişim
              </button>
            </nav>
            
            {/* Language Toggle in Mobile Menu */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleLanguageToggle('TR')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    currentLanguage === 'TR'
                      ? 'bg-[#CE1126] text-white'
                      : 'text-gray-600 border border-gray-300 hover:border-[#CE1126] hover:text-[#CE1126]'
                  }`}
                >
                  TR
                </button>
                <button 
                  onClick={() => handleLanguageToggle('EN')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                    currentLanguage === 'EN'
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
              <h3 className="text-sm font-medium text-gray-900 mb-2">Takip Et</h3>
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
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Filistin İçin <span className="text-[#CE1126]">Birlikte</span> Duralım
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
            58,573+ canın kaybedildiği, 139,607+ kişinin yaralandığı Gazze&apos;de süren insani krize 
            karşı Türkiye&apos;den ses çıkarıyoruz. Sessiz kalmayacağız, umudunu kaybetmeyeceğiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('hareket')}
              className="bg-[#CE1126] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B00E20] transition-colors shadow-lg"
            >
              Harekete Geç
            </button>
            <button 
              onClick={() => scrollToSection('bilgi')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#CE1126] transition-colors shadow-lg"
            >
              Bilgi Al
            </button>
          </div>
        </div>
      </section>

      {/* Current Situation Section */}
      <section id="bilgi" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Güncel Durum</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Filistin&apos;de yaşanan insani krizin güncel verileri
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">58,573+</div>
              <div className="text-gray-600">Hayatını kaybeden Filistinli</div>
              <div className="text-xs text-gray-500 mt-1">(Ağustos 2025)</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">139,607+</div>
              <div className="text-gray-600">Yaralanan kişi</div>
              <div className="text-xs text-gray-500 mt-1">(Ağustos 2025)</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">90%</div>
              <div className="text-gray-600">Yerinden edilmiş nüfus</div>
              <div className="text-xs text-gray-500 mt-1">Gazze&apos;de</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">45,000</div>
              <div className="text-gray-600">Ton yardım malzemesi</div>
              <div className="text-xs text-gray-500 mt-1">Türkiye&apos;den</div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Filistin&apos;in Tarihi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temel tarihsel olaylar ve dönüm noktaları
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-[#CE1126] rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-gray-900">1948 - Nakba (Felaket)</h3>
                <p className="text-gray-600">İsrail&apos;in kurulması ve 750,000 Filistinlinin yerlerinden edilmesi</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-[#007A3D] rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-gray-900">1967 - Altı Gün Savaşı</h3>
                <p className="text-gray-600">Batı Şeria, Gazze, Doğu Kudüs ve Golan Tepeleri&apos;nin işgali</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-[#CE1126] rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-gray-900">2007 - Gazze Ablukası</h3>
                <p className="text-gray-600">2.3 milyon insanın açık hava hapishanesi yaşamı</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-[#007A3D] rounded-full mt-1 flex-shrink-0"></div>
              <div>
                <h3 className="font-bold text-gray-900">2023-2025 - Gazze Saldırıları</h3>
                <p className="text-gray-600">58,573+ can kaybı, 139,607+ yaralı, nüfusun %90&apos;ı yerinden edildi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Section */}
      <section id="hareket" className="py-20 bg-[#CE1126] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Sesini Yükselt</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Filistin için yapabileceğin eylemler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">📢 Farkındalık Yarat</h3>
              <p className="mb-4">Sosyal medyada paylaş, çevrende konuş</p>
              <button 
                onClick={handleShare}
                className="bg-white text-[#CE1126] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                Paylaş
              </button>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">✍️ Dilekçe İmzala</h3>
              <p className="mb-4">Hükümet ve uluslararası kuruluşlara sesini duyur</p>
              <button 
                onClick={handlePetition}
                className="bg-white text-[#CE1126] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                İmzala
              </button>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">🛒 Ekonomik Direniş</h3>
              <p className="mb-4">BDS hareketiyle dayanışma: Boykot, Yaptırım, Yatırım Çekme</p>
              <button 
                onClick={handleBoycottList}
                className="bg-white text-[#CE1126] px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                BDS Listesi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="haberler" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Son Haberler</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Filistin&apos;den güncel gelişmeler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-red-600 font-medium mb-2">ACİL</div>
                <h3 className="font-bold text-gray-900 mb-2">Gazze&apos;de Açlık Krizi Derinleşiyor</h3>
                <p className="text-gray-600 text-sm">BM uzmanları Gazze&apos;deki açlık krizinin facia boyutlarında olduğunu bildirdi. Her 3 kişiden birinin günlerce aç kaldığı rapor edildi.</p>
                <div className="text-xs text-gray-400 mt-2">BM Raporu - Ağustos 2025</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-blue-600 font-medium mb-2">TÜRKİYE</div>
                <h3 className="font-bold text-gray-900 mb-2">İstanbul&apos;da Filistin Dayanışması</h3>
                <p className="text-gray-600 text-sm">15 STK&apos;nın oluşturduğu Filistin Dayanışma Platformu İstanbul&apos;da meşaleli yürüyüş düzenledi. &quot;Gazze için Umut Işığı Ol&quot; sloganıyla binlerce kişi yürüdü.</p>
                <div className="text-xs text-gray-400 mt-2">Ağustos 2025</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-green-600 font-medium mb-2">YARDIM</div>
                <h3 className="font-bold text-gray-900 mb-2">Türkiye&apos;den 45,000 Ton Yardım</h3>
                <p className="text-gray-600 text-sm">Cumhurbaşkanı Erdoğan, Türkiye&apos;nin Gazze&apos;ye toplam 45,000 ton insani yardım malzemesi gönderdiğini açıkladı. Türkiye Filistin&apos;in en büyük yardım ortaklarından biri.</p>
                <div className="text-xs text-gray-400 mt-2">T.C. Cumhurbaşkanlığı</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-purple-600 font-medium mb-2">SAĞLIK</div>
                <h3 className="font-bold text-gray-900 mb-2">Çocuklarda Yetersiz Beslenme Artıyor</h3>
                <p className="text-gray-600 text-sm">5 yaş altı çocuklarda akut yetersiz beslenme oranı %9&apos;a yükseldi. Gazze Şehri&apos;nde bu oran %16&apos;ya çıktı. 100,000 kadın ve çocuk ciddi yetersiz beslenme yaşıyor.</p>
                <div className="text-xs text-gray-400 mt-2">WHO Raporu</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-orange-600 font-medium mb-2">DİPLOMASİ</div>
                <h3 className="font-bold text-gray-900 mb-2">Uluslararası Tanınma Hamlesi</h3>
                <p className="text-gray-600 text-sm">İngiltere, Fransa ve Kanada Filistin devletini tanımayı planlıyor. Gazze&apos;deki açlığa karşı uluslararası baskı artıyor.</p>
                <div className="text-xs text-gray-400 mt-2">Diplomatik Kaynaklar</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="text-sm text-red-600 font-medium mb-2">İNSANİ KRİZ</div>
                <h3 className="font-bold text-gray-900 mb-2">Yardım Dağıtımında Saldırı</h3>
                <p className="text-gray-600 text-sm">Mayıs&apos;tan beri 1,000&apos;den fazla Filistinli yardım almaya çalışırken hayatını kaybetti. Çoğu yardım dağıtım merkezlerinde öldürüldü.</p>
                <div className="text-xs text-gray-400 mt-2">BM İnsan Hakları Ofisi</div>
              </div>
            </div>
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
                />
                <span className="text-xl font-bold">Özgür Filistin</span>
              </div>
              <p className="text-gray-400">Türkiye&apos;den Filistin&apos;e destek platformu</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigation('#')} className="hover:text-white text-left">Ana Sayfa</button></li>
                <li><a href="/bilgilendirme" className="hover:text-white text-left block">Bilgilendirme</a></li>
                <li><a href="/haberler" className="hover:text-white text-left block">Haberler</a></li>
                <li><a href="/eylemler" className="hover:text-white text-left block">Eylemler</a></li>
                <li><button onClick={() => scrollToSection('iletisim')} className="hover:text-white text-left">İletişim</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Eylemler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handlePetition} className="hover:text-white text-left">Dilekçe İmzala</button></li>
                <li><button onClick={handleBoycottList} className="hover:text-white text-left">Boykot Listesi</button></li>
                <li><button onClick={handleShare} className="hover:text-white text-left">Farkındalık</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@ozgurfilistin.tr</li>
                <li>@OzgurFilistin</li>
                <li>Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>Made with ❤️ for Palestine by Turkish supporters</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
