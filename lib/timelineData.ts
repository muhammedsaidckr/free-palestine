export interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  type: 'tragedy' | 'resistance' | 'international' | 'current';
  isExpanded?: boolean;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'nakba',
    year: 1948,
    date: '1948',
    title: {
      tr: 'Nakba (Felaket)',
      en: 'Nakba (Catastrophe)'
    },
    description: {
      tr: '750,000 Filistinli evlerinden zorla çıkarıldı ve mülteci durumuna düştü. 400\'den fazla Filistin köyü yok edildi.',
      en: '750,000 Palestinians were forcibly displaced from their homes and became refugees. Over 400 Palestinian villages were destroyed.'
    },
    type: 'tragedy'
  },
  {
    id: 'six-day-war',
    year: 1967,
    date: '1967',
    title: {
      tr: 'Altı Gün Savaşı',
      en: 'Six-Day War'
    },
    description: {
      tr: 'İsrail Batı Şeria, Gazze Şeridi, Doğu Kudüs ve diğer toprakları işgal etti. Binlerce Filistinli daha mülteci oldu.',
      en: 'Israel occupied the West Bank, Gaza Strip, East Jerusalem and other territories. Thousands more Palestinians became refugees.'
    },
    type: 'tragedy'
  },
  {
    id: 'first-intifada',
    year: 1987,
    date: '1987-1993',
    title: {
      tr: 'Birinci İntifada',
      en: 'First Intifada'
    },
    description: {
      tr: 'Filistin halkının işgale karşı büyük direnişi başladı. Sivil itaatsizlik ve barışçıl protesto dönemi.',
      en: 'The Palestinian uprising against occupation began. A period of civil disobedience and peaceful protests.'
    },
    type: 'resistance'
  },
  {
    id: 'oslo-accords',
    year: 1993,
    date: '1993',
    title: {
      tr: 'Oslo Anlaşmaları',
      en: 'Oslo Accords'
    },
    description: {
      tr: 'Filistin Kurtuluş Örgütü ve İsrail arasında barış süreci başlatıldı. Ancak işgal devam etti.',
      en: 'Peace process initiated between the PLO and Israel. However, the occupation continued.'
    },
    type: 'international'
  },
  {
    id: 'second-intifada',
    year: 2000,
    date: '2000-2005',
    title: {
      tr: 'İkinci İntifada',
      en: 'Second Intifada'
    },
    description: {
      tr: 'Ariel Sharon\'ın Harem-i Şerif\'i ziyareti sonrası başlayan direnişte binlerce kişi hayatını kaybetti.',
      en: 'Following Ariel Sharon\'s visit to Al-Aqsa Mosque, thousands lost their lives in the uprising that followed.'
    },
    type: 'resistance'
  },
  {
    id: 'gaza-blockade',
    year: 2007,
    date: '2007',
    title: {
      tr: 'Gazze Ablukası Başlangıcı',
      en: 'Gaza Blockade Begins'
    },
    description: {
      tr: 'İsrail ve Mısır, Gazze\'ye kara, deniz ve hava ablukası uygulamaya başladı. 2.3 milyon kişi açık hava hapishanesinde.',
      en: 'Israel and Egypt began land, sea and air blockade of Gaza. 2.3 million people trapped in open-air prison.'
    },
    type: 'tragedy'
  },
  {
    id: 'gaza-war-2008',
    year: 2008,
    date: '2008-2009',
    title: {
      tr: 'Gazze Savaşı',
      en: 'Gaza War'
    },
    description: {
      tr: 'İsrail\'in "Dökme Kurşun" operasyonunda 1,400\'den fazla Filistinli, çoğu sivil, hayatını kaybetti.',
      en: 'Over 1,400 Palestinians, mostly civilians, were killed in Israel\'s "Cast Lead" operation.'
    },
    type: 'tragedy'
  },
  {
    id: 'gaza-war-2014',
    year: 2014,
    date: '2014',
    title: {
      tr: 'Gazze Savaşı 2014',
      en: 'Gaza War 2014'
    },
    description: {
      tr: '"Koruyucu Hat" operasyonunda 2,200\'den fazla Filistinli hayatını kaybetti. 500\'den fazla çocuk öldürüldü.',
      en: 'Over 2,200 Palestinians lost their lives in "Protective Edge" operation. More than 500 children were killed.'
    },
    type: 'tragedy'
  },
  {
    id: 'great-march',
    year: 2018,
    date: '2018-2019',
    title: {
      tr: 'Büyük Dönüş Yürüyüşü',
      en: 'Great March of Return'
    },
    description: {
      tr: 'Gazze sınırında barışçıl protestolarda 200\'den fazla Filistinli İsrail askerleri tarafından öldürüldü.',
      en: 'Over 200 Palestinians were killed by Israeli forces during peaceful protests at Gaza border.'
    },
    type: 'resistance'
  },
  {
    id: 'sheikh-jarrah',
    year: 2021,
    date: '2021',
    title: {
      tr: 'Şeyh Cerrah ve Mescid-i Aksa',
      en: 'Sheikh Jarrah and Al-Aqsa'
    },
    description: {
      tr: 'Şeyh Cerrah\'ta zorla tahliyeler ve Mescid-i Aksa\'ya saldırılar sonrası 11 günlük savaşta 260 Filistinli öldürüldü.',
      en: 'Following forced evictions in Sheikh Jarrah and attacks on Al-Aqsa, 260 Palestinians were killed in 11-day war.'
    },
    type: 'tragedy'
  },
  {
    id: 'current-genocide',
    year: 2023,
    date: '2023-Devam ediyor',
    title: {
      tr: 'Devam Eden Soykırım',
      en: 'Ongoing Genocide'
    },
    description: {
      tr: '7 Ekim\'den bu yana 58,573\'ü aşkın Filistinli hayatını kaybetti. Gazze\'nin %90\'ı harap edildi.',
      en: 'Over 58,573 Palestinians have been killed since October 7. 90% of Gaza has been destroyed.'
    },
    type: 'current'
  }
];