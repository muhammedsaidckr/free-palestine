export interface BoycottItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'technology' | 'food' | 'fashion' | 'finance' | 'entertainment' | 'automotive' | 'other';
  reason: {
    tr: string;
    en: string;
  };
  alternatives: {
    name: string;
    description: {
      tr: string;
      en: string;
    };
  }[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  sources: string[];
  lastUpdated: string;
}

export const boycottItems: BoycottItem[] = [
  {
    id: '1',
    name: 'McDonald\'s',
    nameEn: 'McDonald\'s',
    category: 'food',
    reason: {
      tr: 'İsrail\'deki McDonald\'s şubelerine ücretsiz yemek sağlayarak İsrail ordusunu destekliyor.',
      en: 'Provides free meals to Israeli military forces through McDonald\'s branches in Israel.'
    },
    alternatives: [
      {
        name: 'Burger King Türkiye',
        description: {
          tr: 'Yerel franchise ile işletilen alternatif fast food zinciri',
          en: 'Alternative fast food chain operated through local franchise'
        }
      },
      {
        name: 'Komagene',
        description: {
          tr: 'Türk menşeli döner ve çiğ köfte zinciri',
          en: 'Turkish origin döner and çiğ köfte chain'
        }
      }
    ],
    severity: 'high',
    sources: ['https://bdsmovement.net/news/mcdonalds-facing-boycotts-worldwide-over-free-meals-israeli-army'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Starbucks',
    nameEn: 'Starbucks',
    category: 'food',
    reason: {
      tr: 'Starbucks, Filistin destekçisi işçi sendikaları ile yaşanan anlaşmazlıklar ve İsrail\'e verdiği destek nedeniyle boykot ediliyor.',
      en: 'Boycotted due to conflicts with pro-Palestine worker unions and support for Israel.'
    },
    alternatives: [
      {
        name: 'Kahve Dünyası',
        description: {
          tr: 'Türk menşeli kahve zinciri',
          en: 'Turkish origin coffee chain'
        }
      },
      {
        name: 'Selamlique',
        description: {
          tr: 'Geleneksel Türk kahvesi ve çay markası',
          en: 'Traditional Turkish coffee and tea brand'
        }
      }
    ],
    severity: 'high',
    sources: ['https://bdsmovement.net/news/starbucks-workers-united-solidarity-palestine'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '3',
    name: 'Coca-Cola',
    nameEn: 'Coca-Cola',
    category: 'food',
    reason: {
      tr: 'İsrail\'de fabrikaları bulunan ve İsrail ekonomisine katkı sağlayan global marka.',
      en: 'Global brand with factories in Israel contributing to Israeli economy.'
    },
    alternatives: [
      {
        name: 'Uludağ Gazoz',
        description: {
          tr: 'Türk menşeli geleneksel gazozu',
          en: 'Traditional Turkish soft drink'
        }
      },
      {
        name: 'Kızılay Maden Suyu',
        description: {
          tr: 'Türk menşeli maden suyu markası',
          en: 'Turkish origin mineral water brand'
        }
      }
    ],
    severity: 'medium',
    sources: ['https://bdsmovement.net/news/coca-cola-israel-palestine'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '4',
    name: 'Puma',
    nameEn: 'Puma',
    category: 'fashion',
    reason: {
      tr: 'İsrail Futbol Federasyonu\'nun resmi sponsoru ve ilegal yerleşimlerdeki takımları destekliyor.',
      en: 'Official sponsor of Israeli Football Association and supports teams in illegal settlements.'
    },
    alternatives: [
      {
        name: 'Lescon',
        description: {
          tr: 'Türk menşeli spor ayakkabı markası',
          en: 'Turkish origin sports shoe brand'
        }
      },
      {
        name: 'Kinetix',
        description: {
          tr: 'FLO\'ya ait spor ayakkabı markası',
          en: 'Sports shoe brand owned by FLO'
        }
      }
    ],
    severity: 'critical',
    sources: ['https://bdsmovement.net/news/puma-israel-football-association'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '5',
    name: 'HP (Hewlett-Packard)',
    nameEn: 'HP (Hewlett-Packard)',
    category: 'technology',
    reason: {
      tr: 'İsrail\'in işgal bölgelerindeki kontrol noktalarında kullanılan teknolojik altyapıyı sağlıyor.',
      en: 'Provides technological infrastructure used in Israeli checkpoints in occupied territories.'
    },
    alternatives: [
      {
        name: 'Casper',
        description: {
          tr: 'Türk menşeli bilgisayar markası',
          en: 'Turkish origin computer brand'
        }
      },
      {
        name: 'Asus',
        description: {
          tr: 'Tayvan menşeli teknoloji markası',
          en: 'Taiwan origin technology brand'
        }
      }
    ],
    severity: 'critical',
    sources: ['https://bdsmovement.net/news/hp-complicity-israeli-occupation'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '6',
    name: 'Carrefour',
    nameEn: 'Carrefour',
    category: 'other',
    reason: {
      tr: 'İsrail\'deki mağazaları üzerinden İsrail ekonomisine katkı sağlayan Fransız perakende zinciri.',
      en: 'French retail chain contributing to Israeli economy through its stores in Israel.'
    },
    alternatives: [
      {
        name: 'Migros',
        description: {
          tr: 'Türkiye\'nin önemli perakende zincirlerinden biri',
          en: 'One of Turkey\'s major retail chains'
        }
      },
      {
        name: 'A101',
        description: {
          tr: 'Türk menşeli perakende marketi zinciri',
          en: 'Turkish origin retail market chain'
        }
      }
    ],
    severity: 'medium',
    sources: ['https://bdsmovement.net/news/carrefour-israel-palestine'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '7',
    name: 'Zara',
    nameEn: 'Zara',
    category: 'fashion',
    reason: {
      tr: 'İsrail\'de çok sayıda mağazası bulunan ve İsrail ekonomisine katkı sağlayan moda markası.',
      en: 'Fashion brand with numerous stores in Israel contributing to Israeli economy.'
    },
    alternatives: [
      {
        name: 'Defacto',
        description: {
          tr: 'Türk menşeli moda markası',
          en: 'Turkish origin fashion brand'
        }
      },
      {
        name: 'LC Waikiki',
        description: {
          tr: 'Türkiye merkezli global moda zinciri',
          en: 'Turkey-based global fashion chain'
        }
      }
    ],
    severity: 'medium',
    sources: ['https://bdsmovement.net/news/zara-israel-stores'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '8',
    name: 'Netflix',
    nameEn: 'Netflix',
    category: 'entertainment',
    reason: {
      tr: 'İsrail yapımı propaganda içeriklerini yayınlayan ve İsrail\'i normalleştiren platform.',
      en: 'Platform that broadcasts Israeli propaganda content and normalizes Israel.'
    },
    alternatives: [
      {
        name: 'Exxen',
        description: {
          tr: 'Türk menşeli dijital yayın platformu',
          en: 'Turkish origin digital streaming platform'
        }
      },
      {
        name: 'BluTV',
        description: {
          tr: 'Türkiye merkezli dijital içerik platformu',
          en: 'Turkey-based digital content platform'
        }
      }
    ],
    severity: 'medium',
    sources: ['https://bdsmovement.net/news/netflix-israeli-content'],
    lastUpdated: '2024-01-15'
  }
];

export const boycottCategories = {
  technology: {
    tr: 'Teknoloji',
    en: 'Technology'
  },
  food: {
    tr: 'Gıda & İçecek',
    en: 'Food & Beverage'
  },
  fashion: {
    tr: 'Moda & Giyim',
    en: 'Fashion & Clothing'
  },
  finance: {
    tr: 'Finans & Bankacılık',
    en: 'Finance & Banking'
  },
  entertainment: {
    tr: 'Eğlence & Medya',
    en: 'Entertainment & Media'
  },
  automotive: {
    tr: 'Otomotiv',
    en: 'Automotive'
  },
  other: {
    tr: 'Diğer',
    en: 'Other'
  }
};

export const severityLevels = {
  critical: {
    tr: 'Kritik',
    en: 'Critical',
    color: 'bg-red-600'
  },
  high: {
    tr: 'Yüksek',
    en: 'High',
    color: 'bg-orange-600'
  },
  medium: {
    tr: 'Orta',
    en: 'Medium',
    color: 'bg-yellow-600'
  },
  low: {
    tr: 'Düşük',
    en: 'Low',
    color: 'bg-green-600'
  }
};