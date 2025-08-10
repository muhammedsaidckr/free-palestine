import { BoycottList } from '@/components/BoycottList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boykot Listesi - Özgür Filistin | Boycott List - Free Palestine',
  description: 'İsrail\'i destekleyen markaların kapsamlı boykot listesi ve Türk alternatifler. Comprehensive boycott list of brands supporting Israel with Turkish alternatives.',
  keywords: 'boykot, boycott, İsrail, Israel, Filistin, Palestine, markalar, brands, alternatif, alternative',
  openGraph: {
    title: 'Boykot Listesi - Özgür Filistin',
    description: 'İsrail\'i destekleyen markaların kapsamlı boykot listesi ve Türk alternatifler.',
    type: 'website',
  },
};

export default function BoycottPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#CE1126] to-[#007A3D] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block">Boykot Listesi</span>
              <span className="block text-2xl md:text-3xl font-normal opacity-90 mt-2">
                Boycott List
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              İsrail&apos;i destekleyen markaları tanı, alternatiflerini keşfet
            </p>
            <p className="text-lg opacity-80 leading-relaxed">
              Identify brands supporting Israel, discover their alternatives
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Boykot Hakkında / About Boycotts
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-2">
                  <strong>Türkçe:</strong> Bu liste, İsrail&apos;in Filistin&apos;e yönelik politikalarını destekleyen veya İsrail ekonomisine doğrudan katkı sağlayan markaları içermektedir. Her marka için güvenilir alternatifler sunulmaktadır. Boykot, barışçıl bir protesto yöntemidir.
                </p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>English:</strong> This list includes brands that support Israel&apos;s policies towards Palestine or directly contribute to the Israeli economy. Reliable alternatives are provided for each brand. Boycotting is a peaceful form of protest.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-[#CE1126] mb-2">8+</div>
              <div className="text-gray-600">
                <div>Boykot Edilen Marka</div>
                <div className="text-sm opacity-75">Boycotted Brands</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-[#007A3D] mb-2">20+</div>
              <div className="text-gray-600">
                <div>Türk Alternatifi</div>
                <div className="text-sm opacity-75">Turkish Alternatives</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">7</div>
              <div className="text-gray-600">
                <div>Farklı Kategori</div>
                <div className="text-sm opacity-75">Different Categories</div>
              </div>
            </div>
          </div>

          {/* Priority Legend */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">
              Öncelik Seviyeleri / Priority Levels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Kritik / Critical</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Yüksek / High</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Orta / Medium</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-600"></div>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Düşük / Low</span>
                </span>
              </div>
            </div>
          </div>

          {/* Boycott List Component */}
          <BoycottList />

          {/* Action Call */}
          <div className="bg-gradient-to-r from-[#CE1126] to-[#007A3D] text-white rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Sesini Yükselt / Raise Your Voice
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Her satın alma kararın bir oydur. Bilinçli tercihlerle Filistin&apos;e destek ol.
            </p>
            <p className="opacity-80 mb-6">
              Every purchasing decision is a vote. Support Palestine with conscious choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/eylemler" 
                className="bg-white text-[#CE1126] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Eylemlere Katıl / Join Actions
              </a>
              <a 
                href="/bilgilendirme" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#CE1126] transition-colors"
              >
                Daha Fazla Bilgi / Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}