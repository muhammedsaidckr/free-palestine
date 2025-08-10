export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'international' | 'turkey' | 'solidarity' | 'palestine' | 'humanrights';
  date: string;
  timeAgo: string;
  source: string;
  url?: string;
  imageUrl?: string;
}

export interface NewsSource {
  name: string;
  url: string;
  category: NewsItem['category'];
  language: 'tr' | 'en';
}

// RSS interfaces removed - now using server-side API endpoint

// Fallback mock data for when RSS feeds are unavailable
const MOCK_NEWS_DATA: NewsItem[] = [
  {
    id: 'mock-1',
    title: 'BM Güvenlik Konseyi Gazze için acil oturum düzenledi',
    summary: 'Birleşmiş Milletler Güvenlik Konseyi, Gazze\'deki kötüleşen durumla ilgili acil bir oturum düzenledi.',
    content: 'Birleşmiş Milletler Güvenlik Konseyi, Gazze\'deki sivil halkın yaşadığı zorluklara dikkat çekmek için acil bir oturum düzenledi. Konsey üyeleri, bölgede artan insani krizin çözümü için uluslararası toplumdan daha fazla destek istedi.',
    category: 'international',
    date: new Date().toISOString().split('T')[0],
    timeAgo: '2 saat önce',
    source: 'Palestine Chronicle',
    url: 'https://www.palestinechronicle.com'
  },
  {
    id: 'mock-2',
    title: 'Türkiye\'den Filistin\'e yeni insani yardım konvoyu',
    summary: 'Türkiye, Filistin halkına yönelik yeni bir insani yardım konvoyu gönderdi.',
    content: 'Türk hükümeti ve sivil toplum kuruluşlarının ortaklaşa hazırladığı yardım konvoyu, tıbbi malzeme, gıda ve temel ihtiyaç maddelerini içeriyor. Konvoy, Rafah sınır kapısından bölgeye giriş yapacak.',
    category: 'turkey',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '4 saat önce',
    source: 'TRT World',
    url: 'https://www.trtworld.com'
  },
  {
    id: 'mock-3',
    title: 'Dünya çapında Filistin dayanışma gösterileri devam ediyor',
    summary: 'Küresel dayanışma hareketi kapsamında dünya genelinde Filistin destek gösterileri düzenleniyor.',
    content: 'Londra, Paris, Berlin, New York ve İstanbul başta olmak üzere dünya çapında yüzbinlerce kişi Filistin halkı için sokağa çıktı. Göstericiler, uluslararası toplumdan Gazze\'deki krizin sona erdirilmesi için daha fazla eylem talep etti.',
    category: 'solidarity',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '1 gün önce',
    source: 'Middle East Monitor',
    url: 'https://www.middleeastmonitor.com'
  },
  {
    id: 'mock-4',
    title: 'WAFA: Gazze\'de okul binalarının yeniden inşa çalışmaları başladı',
    summary: 'Filistin haber ajansı WAFA, Gazze\'de hasar gören eğitim tesislerinin onarım çalışmalarının başladığını duyurdu.',
    content: 'Filistin Milli Otoritesi ve uluslararası yardım kuruluşlarının ortak çalışmasıyla Gazze\'de hasar gören okulların onarım çalışmaları başladı. İlk etapta 15 okul binasının onarımı planlanıyor.',
    category: 'palestine',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '1 gün önce',
    source: 'WAFA News',
    url: 'https://english.wafa.ps'
  },
  {
    id: 'mock-5',
    title: 'İnsan Hakları Örgütleri: Gazze\'deki durum uluslararası müdahale gerektiriyor',
    summary: 'Uluslararası insan hakları örgütleri, Gazze\'deki durumun acil uluslararası müdahale gerektirdiğini açıkladı.',
    content: 'Human Rights Watch ve Amnesty International gibi önde gelen insan hakları örgütleri ortak bir açıklama yayınlayarak, Gazze\'deki sivil halkın korunması için uluslararası toplumdan acil eylem talep etti.',
    category: 'humanrights',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '2 gün önce',
    source: 'Human Rights Watch',
    url: 'https://www.hrw.org'
  }
];

// NEWS_SOURCES removed - now using server-side API endpoint at /api/news

export class NewsService {
  private static instance: NewsService;
  private cache: Map<string, { data: NewsItem[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      return `${diffInDays} gün önce`;
    }
  }

  private createId(title: string, source: string): string {
    return btoa(`${title}-${source}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  private translateCategory(englishCategory: string, source: NewsSource): NewsItem['category'] {
    if (source.name.toLowerCase().includes('palestine') || 
        source.name.toLowerCase().includes('wafa')) {
      return 'palestine';
    }
    
    if (source.name.toLowerCase().includes('turkey') || 
        source.name.toLowerCase().includes('trt')) {
      return 'turkey';
    }

    // Check content for category classification
    const lowerTitle = englishCategory.toLowerCase();
    if (lowerTitle.includes('human rights') || lowerTitle.includes('humanitarian')) {
      return 'humanrights';
    }
    if (lowerTitle.includes('solidarity') || lowerTitle.includes('support')) {
      return 'solidarity';
    }
    if (lowerTitle.includes('un') || lowerTitle.includes('international')) {
      return 'international';
    }

    return source.category;
  }

  // RSS parsing methods preserved for future server-side implementation
  // Currently using curated mock data due to CORS limitations in client-side RSS fetching

  public async getAllNews(): Promise<NewsItem[]> {
    const cacheKey = 'all-news';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const news = data.news as NewsItem[];
      
      console.log(`Fetched ${news.length} articles from ${data.source} source`);
      
      this.cache.set(cacheKey, { data: news, timestamp: Date.now() });
      return news;
    } catch (error) {
      console.error('Error fetching news from API:', error);
      
      // Fallback to mock data if API fails
      return MOCK_NEWS_DATA.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  public async getNewsByCategory(category: NewsItem['category']): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    return allNews.filter(item => item.category === category);
  }

  public async searchNews(query: string): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    const lowerQuery = query.toLowerCase();
    
    return allNews.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.summary.toLowerCase().includes(lowerQuery)
    );
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const newsService = NewsService.getInstance();