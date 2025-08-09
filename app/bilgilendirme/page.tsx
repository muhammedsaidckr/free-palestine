'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function InformationPage() {
  const [activeTab, setActiveTab] = useState('history');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'history', label: 'Tarih', icon: '📜' },
    { id: 'current', label: 'Güncel Durum', icon: '📊' },
    { id: 'culture', label: 'Kültür', icon: '🎨' },
    { id: 'legal', label: 'Hukuki Durum', icon: '⚖️' }
  ];

  const historyTimeline = [
    {
      year: '1917',
      title: 'Balfour Deklarasyonu',
      description: 'Britanya, Filistin\'de Yahudiler için "ulusal bir yuva" kurulmasını desteklediğini açıkladı.',
      importance: 'critical'
    },
    {
      year: '1947',
      title: 'BM Paylaşım Planı',
      description: 'Birleşmiş Milletler, Filistin\'i bölme kararı aldı. Filistinliler bu planı reddetti.',
      importance: 'critical'
    },
    {
      year: '1948',
      title: 'Nakba (Felaket)',
      description: 'İsrail\'in kurulması ve 750,000 Filistinlinin zorla yerlerinden edilmesi.',
      importance: 'critical'
    },
    {
      year: '1967',
      title: 'Altı Gün Savaşı',
      description: 'İsrail, Batı Şeria, Gazze Şeridi, Doğu Kudüs ve Golan Tepelerini işgal etti.',
      importance: 'high'
    },
    {
      year: '1987',
      title: 'Birinci İntifada',
      description: 'Filistin halkının işgale karşı kitle ayaklanması başladı.',
      importance: 'high'
    },
    {
      year: '1993',
      title: 'Oslo Anlaşmaları',
      description: 'İsrail ile FKÖ arasında barış görüşmeleri başladı.',
      importance: 'medium'
    },
    {
      year: '2000',
      title: 'İkinci İntifada',
      description: 'Camp David görüşmelerinin başarısızlığından sonra ikinci ayaklanma başladı.',
      importance: 'high'
    },
    {
      year: '2007',
      title: 'Gazze Ablukası',
      description: 'İsrail, Gazze\'ye kara, deniz ve hava ablukası uygulamaya başladı.',
      importance: 'critical'
    },
    {
      year: '2023',
      title: 'Günümüz',
      description: 'Gazze\'deki durum kritik seviyelere ulaştı, uluslararası destek artıyor.',
      importance: 'critical'
    }
  ];

  const currentStats = [
    { 
      title: 'Gazze Nüfusu', 
      value: '2.3 milyon', 
      description: '365 km²\'lik alanda yaşayan insan sayısı',
      trend: 'stable'
    },
    { 
      title: 'İşgal Süresi', 
      value: '75+ yıl', 
      description: '1948\'den bu yana süren işgal',
      trend: 'increasing'
    },
    { 
      title: 'Mülteci Sayısı', 
      value: '5.9 milyon', 
      description: 'Kayıtlı Filistinli mülteci sayısı',
      trend: 'increasing'
    },
    { 
      title: 'Yerleşim Birimleri', 
      value: '280+', 
      description: 'Batı Şeria\'daki yasadışı İsrail yerleşimleri',
      trend: 'increasing'
    }
  ];

  const culturalAspects = [
    {
      title: 'Geleneksel El Sanatları',
      description: 'Tatreez (geleneksel nakış), çömlek, halıcılık',
      image: '/placeholder-craft.jpg',
      details: 'Filistin kadınları tarafından yüzyıllardır sürdürülen geleneksel el sanatları, kültürel kimliğin önemli bir parçasıdır.'
    },
    {
      title: 'Mutfak Kültürü',
      description: 'Hummus, falafel, musakhan, kunefe',
      image: '/placeholder-food.jpg',
      details: 'Akdeniz ve Ortadoğu mutfağının özelliklerini taşıyan Filistin mutfağı, zeytinyağı ve baharatlar ağırlıklıdır.'
    },
    {
      title: 'Müzik ve Dans',
      description: 'Dabke, oud, geleneksel şarkılar',
      image: '/placeholder-music.jpg',
      details: 'Dabke, toplu olarak oynanan geleneksel Filistin dansıdır ve dayanışmayı simgeler.'
    },
    {
      title: 'Edebiyat',
      description: 'Mahmoud Darwish, Fadwa Tuqan, Edward Said',
      image: '/placeholder-books.jpg',
      details: 'Filistin edebiyatı, direnç ve umut temalarını işleyerek dünya çapında tanınır.'
    }
  ];

  const legalInfo = [
    {
      title: 'BM Kararları',
      content: 'Filistin ile ilgili 100\'den fazla BM kararı İsrail tarafından uygulanmamıştır.',
      status: 'violated'
    },
    {
      title: 'Uluslararası Hukuk',
      content: 'İsrail\'in yerleşim faaliyetleri 4. Cenevre Sözleşmesi\'ne göre yasadışıdır.',
      status: 'violated'
    },
    {
      title: 'İnsan Hakları',
      content: 'İnsan Hakları Evrensel Beyannamesi\'nin birçok maddesi ihlal edilmektedir.',
      status: 'violated'
    },
    {
      title: 'Mülteci Hakları',
      content: 'Filistinli mültecilerin geri dönüş hakkı BM kararlarıyla tanınmıştır.',
      status: 'recognized'
    }
  ];

  const faqs = [
    {
      question: 'Filistin sorunu nasıl başladı?',
      answer: 'Filistin sorunu, 1917 Balfour Deklarasyonu ile başlayan süreçte, Britanya\'nın Filistin topraklarında Yahudiler için bir "ulusal yuva" kurulmasını desteklemesiyle ortaya çıktı. 1948\'de İsrail\'in kurulması ve 750,000 Filistinlinin yerlerinden edilmesi (Nakba) ile soruna dönüştü.'
    },
    {
      question: 'Gazze ablukası nedir?',
      answer: 'Gazze ablukası, 2007\'den bu yana İsrail tarafından uygulanan kara, deniz ve hava ablukasıdır. 2.3 milyon insanın yaşadığı bölge, dünyaya açık hava hapishanesi olarak tanımlanmaktadır.'
    },
    {
      question: 'İki devletli çözüm nedir?',
      answer: 'İki devletli çözüm, İsrail ve Filistin\'in 1967 sınırları temelinde yan yana iki bağımsız devlet olarak yaşaması önerisidir. Uluslararası toplum tarafından desteklenen bu çözüm, Doğu Kudüs\'ün Filistin\'in başkenti olmasını öngörür.'
    },
    {
      question: 'BDS hareketi nedir?',
      answer: 'BDS (Boykot, Yatırım Çekme, Yaptırım) hareketi, İsrail\'in uluslararası hukuka uymasını sağlamak için ekonomik ve kültürel baskı uygulamayı amaçlayan sivil toplum hareketidir.'
    },
    {
      question: 'Türkiye\'nin Filistin politikası nedir?',
      answer: 'Türkiye, iki devletli çözümü desteklemekte, Filistin devletini tanımakta ve insani yardımlarda bulunmaktadır. Türk halkı da Filistin davasına güçlü destek vermektedir.'
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-[#CE1126]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Palestinian Flag"
                width={32}
                height={20}
                className="border border-gray-300"
              />
              <span className="text-xl font-bold text-gray-900">Özgür Filistin</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#CE1126] font-medium">Ana Sayfa</Link>
              <Link href="/bilgilendirme" className="text-[#CE1126] hover:text-[#CE1126] font-medium">Bilgilendirme</Link>
              <Link href="/haberler" className="text-gray-700 hover:text-[#CE1126] font-medium">Haberler</Link>
              <Link href="/eylemler" className="text-gray-700 hover:text-[#CE1126] font-medium">Eylemler</Link>
            </nav>
            
            <Link href="/" className="text-sm text-gray-600 hover:text-[#CE1126]">← Ana Sayfa</Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-[#CE1126] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Bilgilendirme</h1>
          <p className="text-xl opacity-90">Filistin hakkında kapsamlı bilgi ve kaynaklar</p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#CE1126] text-[#CE1126]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Filistin&apos;in Tarihi</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Filistin topraklarının tarihsel süreci ve yaşanan önemli olaylar
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px h-full w-0.5 bg-gray-300"></div>
                <div className="space-y-8">
                  {historyTimeline.map((event, index) => (
                    <div key={index} className="relative flex items-center">
                      <div className={`absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 ${getImportanceColor(event.importance)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {event.year.slice(-2)}
                      </div>
                      
                      <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-1/2 md:pr-8' : 'md:ml-1/2 md:pl-8'} md:w-1/2`}>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#CE1126]">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{event.year}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.importance === 'critical' ? 'bg-red-100 text-red-800' :
                              event.importance === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {event.importance === 'critical' ? 'Kritik' : 
                               event.importance === 'high' ? 'Yüksek' : 'Orta'}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Current Situation Tab */}
          {activeTab === 'current' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Güncel Durum</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Filistin&apos;de yaşanan mevcut durumun sayısal verileri
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentStats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#CE1126]">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                      <span className="text-xl">{getTrendIcon(stat.trend)}</span>
                    </div>
                    <div className="text-3xl font-bold text-[#CE1126] mb-2">{stat.value}</div>
                    <p className="text-gray-600 text-sm">{stat.description}</p>
                  </div>
                ))}
              </div>

              {/* Detailed Current Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-xl font-bold text-red-800 mb-4">🚨 Acil Durum</h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Gazze&apos;de elektrik günde sadece 4-6 saat</li>
                    <li>• Temiz suya erişim %10&apos;un altında</li>
                    <li>• İşsizlik oranı %45&apos;in üzerinde</li>
                    <li>• Çocukların %80&apos;i psikolojik travma yaşıyor</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">🌍 Uluslararası Destek</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• 140+ ülke Filistin devletini tanıyor</li>
                    <li>• BM&apos;nin %70&apos;i Filistin lehinde oy kullanıyor</li>
                    <li>• Dünya çapında BDS hareketi büyüyor</li>
                    <li>• Sivil toplum desteği artıyor</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Culture Tab */}
          {activeTab === 'culture' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Filistin Kültürü</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Binlerce yıllık tarihi olan Filistin kültürünün zenginlikleri
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {culturalAspects.map((aspect, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-r from-[#CE1126]/20 to-[#007A3D]/20 flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{aspect.title}</h3>
                      <p className="text-gray-600 mb-3">{aspect.description}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{aspect.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Traditional Colors */}
              <div className="bg-gradient-to-r from-gray-900 via-[#CE1126] via-white to-[#007A3D] p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Filistin Bayrağı Renkleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-white">
                    <div className="w-16 h-16 bg-black rounded-full mx-auto mb-2"></div>
                    <p className="font-semibold">Siyah</p>
                    <p className="text-sm opacity-75">Abbasiler</p>
                  </div>
                  <div className="text-white">
                    <div className="w-16 h-16 bg-[#CE1126] rounded-full mx-auto mb-2"></div>
                    <p className="font-semibold">Kırmızı</p>
                    <p className="text-sm opacity-75">Haşimiler</p>
                  </div>
                  <div className="text-gray-900">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 border-2 border-gray-300"></div>
                    <p className="font-semibold">Beyaz</p>
                    <p className="text-sm opacity-75">Emeviler</p>
                  </div>
                  <div className="text-white">
                    <div className="w-16 h-16 bg-[#007A3D] rounded-full mx-auto mb-2"></div>
                    <p className="font-semibold">Yeşil</p>
                    <p className="text-sm opacity-75">Fatimiler</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legal Tab */}
          {activeTab === 'legal' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hukuki Durum</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Filistin sorununun uluslararası hukuk çerçevesindeki durumu
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {legalInfo.map((info, index) => (
                  <div key={index} className={`p-6 rounded-lg border-l-4 ${
                    info.status === 'violated' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        info.status === 'violated' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {info.status === 'violated' ? 'İhlal Ediliyor' : 'Tanınıyor'}
                      </span>
                    </div>
                    <p className="text-gray-700">{info.content}</p>
                  </div>
                ))}
              </div>

              {/* Key Documents */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-4">📋 Önemli Belgeler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                  <div>
                    <h4 className="font-semibold mb-2">BM Kararları</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Karar 194 - Mülteci geri dönüş hakkı</li>
                      <li>• Karar 242 - İsrail&apos;in geri çekilmesi</li>
                      <li>• Karar 338 - Ateşkes çağrısı</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Uluslararası Sözleşmeler</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 4. Cenevre Sözleşmesi</li>
                      <li>• İnsan Hakları Evrensel Beyannamesi</li>
                      <li>• Çocuk Hakları Sözleşmesi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-lg text-gray-600">Filistin konusunda merak edilen sorular ve cevapları</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Daha Fazla Kaynak</h2>
            <p className="text-lg text-gray-600">Filistin hakkında daha detaylı bilgi için önerilen kaynaklar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kitaplar</h3>
              <p className="text-gray-600 text-sm">Filistin tarihi ve kültürü üzerine önerilen kitaplar</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belgeseller</h3>
              <p className="text-gray-600 text-sm">Konuyu derinlemesine işleyen belgesel filmler</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Web Siteleri</h3>
              <p className="text-gray-600 text-sm">Güvenilir haber kaynakları ve bilgi siteleri</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
