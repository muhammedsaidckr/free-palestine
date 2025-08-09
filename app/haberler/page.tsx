'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const newsItems = [
    {
      id: 1,
      title: "BM'den Gazze'ye acil insani yardım çağrısı",
      summary: "Birleşmiş Milletler, Gazze'deki kötüleşen insani duruma dikkat çekerek uluslararası toplumdan acil yardım çağrısında bulundu.",
      category: "international",
      date: "2025-08-09",
      timeAgo: "2 saat önce",
      content: "Birleşmiş Milletler İnsani İşler Koordinasyon Ofisi (OCHA), Gazze'deki sivil halkın durumunun her geçen gün daha da kötüleştiğini açıkladı. 2.3 milyon nüfuslu bölgede temel ihtiyaçların karşılanması konusunda ciddi sıkıntılar yaşandığı belirtildi."
    },
    {
      id: 2,
      title: "Türkiye'den Filistin'e kapsamlı destek paketi",
      summary: "Türk hükümeti ve sivil toplum kuruluşları, Filistin halkına yönelik yeni bir destek paketi açıkladı.",
      category: "turkey",
      date: "2025-08-09",
      timeAgo: "4 saat önce",
      content: "Türkiye Diyanet Vakfı ve TİKA koordinasyonunda hazırlanan paket kapsamında tıbbi malzeme, gıda yardımı ve eğitim desteği sağlanacak."
    },
    {
      id: 3,
      title: "Dünya genelinde Filistin dayanışma gösterileri",
      summary: "50'den fazla ülkede eş zamanlı olarak düzenlenen gösterilerle Filistin halkına destek verildi.",
      category: "solidarity",
      date: "2025-08-08",
      timeAgo: "1 gün önce",
      content: "Londra, Paris, Berlin, New York ve İstanbul başta olmak üzere dünya çapında milyonlarca kişi Filistin halkı için sokağa çıktı."
    },
    {
      id: 4,
      title: "Uluslararası Adalet Divanı'ndan kritik açıklama",
      summary: "UCM, bölgedeki durumla ilgili inceleme sürecinin devam ettiğini açıkladı.",
      category: "international",
      date: "2025-08-08",
      timeAgo: "1 gün önce",
      content: "Lahey'deki Uluslararası Ceza Mahkemesi, bölgedeki olaylarla ilgili delilleri incelemeye devam ettiğini belirtti."
    },
    {
      id: 5,
      title: "Türk sanatçılardan Filistin'e destek konseri",
      summary: "Ünlü Türk sanatçılar, Filistin için özel bir konser düzenleyerek gelirini bağışlayacak.",
      category: "turkey",
      date: "2025-08-07",
      timeAgo: "2 gün önce",
      content: "Sezen Aksu, Tarkan ve Ajda Pekkan'ın da aralarında bulunduğu sanatçılar, 15 Ağustos'ta İstanbul'da özel bir konser verecek."
    },
    {
      id: 6,
      title: "Gazze'de yeniden inşa çalışmaları için uluslararası fon",
      summary: "AB ve İslam İşbirliği Teşkilatı, Gazze'nin yeniden inşası için ortak fon oluşturdu.",
      category: "international",
      date: "2025-08-07",
      timeAgo: "2 gün önce",
      content: "500 milyon dolarlık fon, altyapı ve konut projelerine odaklanacak."
    }
  ];

  const categories = [
    { key: 'all', label: 'Tümü', count: newsItems.length },
    { key: 'international', label: 'Uluslararası', count: newsItems.filter(item => item.category === 'international').length },
    { key: 'turkey', label: 'Türkiye', count: newsItems.filter(item => item.category === 'turkey').length },
    { key: 'solidarity', label: 'Dayanışma', count: newsItems.filter(item => item.category === 'solidarity').length }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'international': return 'bg-blue-100 text-blue-800';
      case 'turkey': return 'bg-red-100 text-red-800';
      case 'solidarity': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'international': return 'Uluslararası';
      case 'turkey': return 'Türkiye';
      case 'solidarity': return 'Dayanışma';
      default: return 'Genel';
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
              <Link href="/bilgilendirme" className="text-gray-700 hover:text-[#CE1126] font-medium">Bilgilendirme</Link>
              <Link href="/haberler" className="text-[#CE1126] hover:text-[#CE1126] font-medium">Haberler</Link>
              <Link href="/eylemler" className="text-gray-700 hover:text-[#CE1126] font-medium">Eylemler</Link>
            </nav>
            
            <Link href="/" className="text-sm text-gray-600 hover:text-[#CE1126]">← Ana Sayfa</Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-[#CE1126] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Haberler</h1>
          <p className="text-xl opacity-90">Filistin ve dayanışma hareketinden güncel gelişmeler</p>
        </div>
      </section>

      {/* News Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar - Categories */}
            <aside className="lg:w-1/4">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-4">Kategoriler</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center ${
                        selectedCategory === category.key
                          ? 'bg-[#CE1126] text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.label}</span>
                      <span className="text-sm opacity-75">({category.count})</span>
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3">Hızlı İstatistikler</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Bugünkü haberler:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bu hafta:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toplam haber:</span>
                      <span className="font-medium">{newsItems.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Breaking News Banner */}
              <div className="bg-red-50 border-l-4 border-[#CE1126] p-4 mb-8">
                <div className="flex items-center">
                  <span className="bg-[#CE1126] text-white text-xs font-bold px-2 py-1 rounded mr-3">SON DAKİKA</span>
                  <p className="text-gray-800">BM&apos;den Gazze&apos;ye acil insani yardım çağrısı</p>
                </div>
              </div>

              {/* News Grid */}
              <div className="space-y-6">
                {filteredNews.map((news, index) => (
                  <article key={news.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                    index === 0 ? 'border-[#CE1126]' : 'border-gray-200'
                  } hover:shadow-lg transition-shadow`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(news.category)}`}>
                            {getCategoryLabel(news.category)}
                          </span>
                          <time className="text-sm text-gray-500">{news.timeAgo}</time>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#CE1126] cursor-pointer">
                        {news.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {news.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <button className="text-[#CE1126] font-medium hover:text-[#B00E20] transition-colors">
                          Devamını oku →
                        </button>
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <button className="hover:text-[#CE1126] flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>124</span>
                          </button>
                          <button className="hover:text-[#CE1126] flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>28</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Daha Fazla Haber Yükle
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter Signup */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Güncel Kalın</h2>
          <p className="text-lg text-gray-600 mb-8">Filistin&apos;den son gelişmeleri e-posta ile alın</p>
          
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
            />
            <button className="bg-[#CE1126] text-white px-6 py-3 rounded-lg hover:bg-[#B00E20] transition-colors font-medium">
              Abone Ol
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-3">
            Haftalık bülten ve önemli gelişmeleri e-posta ile alın
          </p>
        </div>
      </section>
    </div>
  );
}
