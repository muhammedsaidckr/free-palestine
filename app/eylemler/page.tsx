'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PetitionForm from "@/components/PetitionForm";

export default function ActionsPage() {
  const [showBoycottList, setShowBoycottList] = useState(false);
  const [petitionCount, setPetitionCount] = useState<number>(2847);

  const handlePetitionSuccess = (totalCount: number) => {
    setPetitionCount(totalCount);
  };

  const handleShare = (platform: string) => {
    const shareText = "Filistin için birlikte duralım! Türkiye'den Filistin'e destek. #ÖzgürFilistin #FreePalestine";
    const shareUrl = window.location.origin;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Link kopyalandı!');
        });
        break;
    }
  };

  const boycottItems = [
    {
      category: 'Teknoloji',
      items: [
        { name: 'Intel', reason: 'İsrail\'deki ar-ge merkezi', alternatives: ['AMD', 'Qualcomm'] },
        { name: 'HP', reason: 'İsrail ordusuna destek', alternatives: ['Canon', 'Epson'] },
        { name: 'Motorola', reason: 'İsrail\'e teknoloji desteği', alternatives: ['Samsung', 'Xiaomi'] }
      ]
    },
    {
      category: 'Gıda ve İçecek',
      items: [
        { name: 'Coca Cola', reason: 'İsrail\'deki yatırımları', alternatives: ['Cola Turka', 'Yerel markalar'] },
        { name: 'Nestlé', reason: 'İsrail\'deki fabrikaları', alternatives: ['Ülker', 'Pınar'] },
        { name: 'McDonald\'s', reason: 'İsrail\'e ücretsiz yemek desteği', alternatives: ['Yerel burger zincirleri'] }
      ]
    },
    {
      category: 'Kozmetik',
      items: [
        { name: 'L\'Oréal', reason: 'İsrail\'deki ar-ge merkezi', alternatives: ['Flormar', 'Pastel'] },
        { name: 'Garnier', reason: 'L\'Oréal\'e bağlı', alternatives: ['Arko', 'Duru'] }
      ]
    }
  ];

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
              <Link href="/haberler" className="text-gray-700 hover:text-[#CE1126] font-medium">Haberler</Link>
              <Link href="/eylemler" className="text-[#CE1126] hover:text-[#CE1126] font-medium">Eylemler</Link>
            </nav>
            
            <Link href="/" className="text-sm text-gray-600 hover:text-[#CE1126]">← Ana Sayfa</Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-[#CE1126] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Harekete Geç</h1>
          <p className="text-xl opacity-90">Filistin için yapabileceğin eylemler ve destek yolları</p>
        </div>
      </section>

      {/* Actions Grid */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Quick Actions */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hızlı Eylemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Share Action */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#CE1126] transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📢</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Farkındalık Yarat</h3>
                  <p className="text-gray-600">Sosyal medyada paylaş, sesini duyur</p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                    <span>Twitter&apos;da Paylaş</span>
                  </button>
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook&apos;ta Paylaş</span>
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>WhatsApp&apos;ta Paylaş</span>
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Link Kopyala
                  </button>
                </div>
              </div>

              {/* Petition Action */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#CE1126] transition-colors">
                <PetitionForm 
                  onSignatureSuccess={handlePetitionSuccess}
                  compact={true}
                />
              </div>

              {/* Boycott Action */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#CE1126] transition-colors">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bilinçli Tüket</h3>
                  <p className="text-gray-600">Boykot listesini incele</p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowBoycottList(true)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                  >
                    Boykot Listesi
                  </button>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Alternatif Ürünler
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Son güncellenme: 8 Ağustos 2025
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Actions */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Daha Fazla Eylem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Donation */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">💝 Bağış Yap</h3>
                <p className="text-gray-600 mb-4">Güvenilir STK&apos;lar üzerinden Filistin&apos;e yardım et</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                  Bağış Sayfası
                </button>
              </div>

              {/* Education */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">📚 Eğit ve Öğren</h3>
                <p className="text-gray-600 mb-4">Filistin tarihi ve kültürü hakkında daha fazla öğren</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Kaynaklara Git
                </button>
              </div>

              {/* Events */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🎪 Etkinliklere Katıl</h3>
                <p className="text-gray-600 mb-4">Yakın çevrendeki Filistin destek etkinliklerine katıl</p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
                  Etkinlikler
                </button>
              </div>

              {/* Contact MPs */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏛️ Milletvekilinle İletişim</h3>
                <p className="text-gray-600 mb-4">Seçtiğin milletvekiline Filistin konusunda mektup yaz</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  Mektup Şablonları
                </button>
              </div>

              {/* Volunteer */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🤝 Gönüllü Ol</h3>
                <p className="text-gray-600 mb-4">STK&apos;larda gönüllü olarak çalış</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  Gönüllü Başvurusu
                </button>
              </div>

              {/* Local Groups */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">👥 Yerel Gruplar</h3>
                <p className="text-gray-600 mb-4">Şehrindeki Filistin destek gruplarına katıl</p>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                  Grup Bul
                </button>
              </div>
            </div>
          </section>

          {/* Impact Statistics */}
          <section className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Toplu Etkimiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#CE1126]">{petitionCount.toLocaleString()}</div>
                <div className="text-gray-600">İmza Toplandı</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#CE1126]">15,632</div>
                <div className="text-gray-600">Sosyal Paylaşım</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#CE1126]">₺124,890</div>
                <div className="text-gray-600">Bağış Toplandı</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#CE1126]">847</div>
                <div className="text-gray-600">Aktif Gönüllü</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Boycott List Modal */}
      {showBoycottList && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Boykot Listesi</h2>
                <button 
                  onClick={() => setShowBoycottList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-2">İsrail&apos;e destek veren markalar ve Türk alternatifler</p>
            </div>

            <div className="p-6 space-y-8">
              {boycottItems.map((category, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{category.category}</h3>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-red-600">{item.name}</h4>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">BOYKOT</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.reason}</p>
                        <div>
                          <span className="text-sm font-medium text-green-700">Alternatifler: </span>
                          <span className="text-sm text-gray-700">{item.alternatives.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Bu liste sürekli güncellenmektedir. Son güncelleme: 8 Ağustos 2025
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
