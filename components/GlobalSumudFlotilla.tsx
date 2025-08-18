'use client';

import { useState } from 'react';
import { useI18n } from '@/components/I18nProvider';

export default function GlobalSumudFlotilla() {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const flotillaData = {
    tr: {
      title: "Global Sumud Flotilla",
      subtitle: "Gazze'ye En Büyük Sivil Deniz Filosu",
      mission: "Gazze'deki yasadışı kuşatmayı deniz yoluyla kırmak ve insani koridor açmak",
      motto: "Dünya Sessiz Kaldığında, Biz Yelken Açıyoruz",
      participants: {
        title: "Katılımcılar",
        description: "39 ülkeden doktorlar, sanatçılar, din adamları, avukatlar ve denizciler"
      },
      approach: {
        title: "Strateji",
        points: [
          "Küçük ve orta boy gemilerle merkeziyetsiz model",
          "Kara, deniz ve havada küresel koordinasyon",
          "Şiddet içermeyen sivil eylem",
          "Uluslararası farkındalık artırma"
        ]
      },
      getInvolved: {
        title: "Nasıl Katılabilirsiniz",
        actions: [
          "Gemi delegasyonlarına katılın",
          "Denizcilik mürettebatı olarak başvurun",
          "Bağış yapın",
          "Yerel dayanışma eylemleri organize edin"
        ]
      },
      learnMore: "Daha Fazla Bilgi",
      visitWebsite: "Resmi Web Sitesi"
    },
    en: {
      title: "Global Sumud Flotilla",
      subtitle: "Largest Civilian Maritime Fleet to Gaza",
      mission: "Break the illegal siege on Gaza by sea and open a humanitarian corridor",
      motto: "When the World Stays Silent, We Set Sail",
      participants: {
        title: "Participants",
        description: "Doctors, artists, clergy, lawyers, and seafarers from 39 countries"
      },
      approach: {
        title: "Strategy",
        points: [
          "Decentralized model with small to mid-size vessels",
          "Global coordination across land, sea, and air",
          "Nonviolent civilian action",
          "Raising international awareness"
        ]
      },
      getInvolved: {
        title: "How to Get Involved",
        actions: [
          "Join boat delegations",
          "Apply as maritime crew",
          "Make donations",
          "Organize local solidarity actions"
        ]
      },
      learnMore: "Learn More",
      visitWebsite: "Official Website"
    }
  };

  const content = flotillaData.tr;

  return (
    <section className="py-20 bg-gradient-to-b from-[#048b4f] to-[#007A3D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">{content.title}</h2>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md font-medium">
            {content.subtitle}
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-white/30 shadow-xl">
            <p className="text-lg md:text-xl font-semibold mb-4 text-white">{content.mission}</p>
            <p className="text-white italic text-lg md:text-xl font-medium">&quot;{content.motto}&quot;</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#da2832] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">{content.participants.title}</h3>
            </div>
            <p className="text-green-100 text-center leading-relaxed">
              {content.participants.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#da2832] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">{content.approach.title}</h3>
            </div>
            <ul className="space-y-3">
              {content.approach.points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#da2832] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-green-100 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-6 text-center">{content.getInvolved.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.getInvolved.actions.map((action, index) => (
                <div key={index} className="flex items-start p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-[#da2832] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-green-100 leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#da2832] hover:bg-[#c41e2a] text-white px-8 py-3 rounded-lg font-semibold transition-colors mr-4"
          >
            {isExpanded ? 'Daha Az Göster' : content.learnMore}
          </button>
          <a
            href="https://globalsumudflotilla.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block border-2 border-white/30"
          >
            {content.visitWebsite} →
          </a>
        </div>
      </div>
    </section>
  );
}
