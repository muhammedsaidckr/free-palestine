import { NextResponse } from 'next/server';

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

function formatTimeAgo(dateString: string): string {
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

function createId(title: string, source: string): string {
  return btoa(`${title}-${source}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

async function fetchAlJazeeraNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://www.aljazeera.com/tag/israel-palestine-conflict/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract article data using regex patterns (compatible with older JS versions)
    const articlePattern = /<article[^>]*class="[^"]*gc__content[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
    const titlePattern = /<h3[^>]*class="[^"]*gc__title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/;
    const summaryPattern = /<p[^>]*class="[^"]*gc__excerpt[^"]*"[^>]*>([\s\S]*?)<\/p>/;
    const datePattern = /<time[^>]*datetime="([^"]*)"[^>]*>/;
    const imagePattern = /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/;

    const articles = [];
    const articleMatches = html.match(articlePattern) || [];

    for (const articleHtml of articleMatches.slice(0, 10)) {
      const titleMatch = articleHtml.match(titlePattern);
      const summaryMatch = articleHtml.match(summaryPattern);
      const dateMatch = articleHtml.match(datePattern);
      const imageMatch = articleHtml.match(imagePattern);

      if (titleMatch && titleMatch[2]) {
        const title = titleMatch[2].replace(/<[^>]*>/g, '').trim();
        const url = titleMatch[1].startsWith('http') ? titleMatch[1] : `https://www.aljazeera.com${titleMatch[1]}`;
        const summary = summaryMatch ? summaryMatch[1].replace(/<[^>]*>/g, '').trim() : title.substring(0, 150) + '...';
        const dateStr = dateMatch ? dateMatch[1] : new Date().toISOString();
        const imageUrl = imageMatch ? imageMatch[1] : undefined;

        articles.push({
          id: createId(title, 'Al Jazeera'),
          title,
          summary,
          content: summary,
          category: 'palestine' as const,
          date: new Date(dateStr).toISOString().split('T')[0],
          timeAgo: formatTimeAgo(dateStr),
          source: 'Al Jazeera',
          url,
          imageUrl
        });
      }
    }

    return articles;
  } catch (error) {
    console.error('Error fetching Al Jazeera news:', error);
    return [];
  }
}

// Fallback news data in case Al Jazeera is unavailable
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'fallback-1',
    title: 'BM Güvenlik Konseyi Gazze için acil oturum düzenledi',
    summary: 'Birleşmiş Milletler Güvenlik Konseyi, Gazze\'deki kötüleşen durumla ilgili acil bir oturum düzenledi.',
    content: 'Birleşmiş Milletler Güvenlik Konseyi, Gazze\'deki sivil halkın yaşadığı zorluklara dikkat çekmek için acil bir oturum düzenledi. Konsey üyeleri, bölgede artan insani krizin çözümü için uluslararası toplumdan daha fazla destek istedi.',
    category: 'international',
    date: new Date().toISOString().split('T')[0],
    timeAgo: '2 saat önce',
    source: 'Al Jazeera',
    url: 'https://www.aljazeera.com/tag/israel-palestine-conflict/'
  },
  {
    id: 'fallback-2',
    title: 'Türkiye\'den Filistin\'e yeni insani yardım konvoyu',
    summary: 'Türkiye, Filistin halkına yönelik yeni bir insani yardım konvoyu gönderdi.',
    content: 'Türk hükümeti ve sivil toplum kuruluşlarının ortaklaşa hazırladığı yardım konvoyu, tıbbi malzeme, gıda ve temel ihtiyaç maddelerini içeriyor.',
    category: 'turkey',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '4 saat önce',
    source: 'TRT World',
    url: 'https://www.trtworld.com'
  },
  {
    id: 'fallback-3',
    title: 'Dünya çapında Filistin dayanışma gösterileri devam ediyor',
    summary: 'Küresel dayanışma hareketi kapsamında dünya genelinde Filistin destek gösterileri düzenleniyor.',
    content: 'Londra, Paris, Berlin, New York ve İstanbul başta olmak üzere dünya çapında yüzbinlerce kişi Filistin halkı için sokağa çıktı.',
    category: 'solidarity',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '1 gün önce',
    source: 'Middle East Monitor',
    url: 'https://www.middleeastmonitor.com'
  },
  {
    id: 'fallback-4',
    title: 'WAFA: Gazze\'de okul binalarının yeniden inşa çalışmaları başladı',
    summary: 'Filistin haber ajansı WAFA, Gazze\'de hasar gören eğitim tesislerinin onarım çalışmalarının başladığını duyurdu.',
    content: 'Filistin Milli Otoritesi ve uluslararası yardım kuruluşlarının ortak çalışmasıyla Gazze\'de hasar gören okulların onarım çalışmaları başladı.',
    category: 'palestine',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '1 gün önce',
    source: 'WAFA News',
    url: 'https://english.wafa.ps'
  },
  {
    id: 'fallback-5',
    title: 'İnsan Hakları Örgütleri: Gazze\'deki durum uluslararası müdahale gerektiriyor',
    summary: 'Uluslararası insan hakları örgütleri, Gazze\'deki durumun acil uluslararası müdahale gerektirdiğini açıkladı.',
    content: 'Human Rights Watch ve Amnesty International gibi önde gelen insan hakları örgütleri ortak bir açıklama yayınladı.',
    category: 'humanrights',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeAgo: '2 gün önce',
    source: 'Human Rights Watch',
    url: 'https://www.hrw.org'
  }
];

export async function GET() {
  try {
    // Try to fetch from Al Jazeera
    const alJazeeraNews = await fetchAlJazeeraNews();
    
    // If we got news from Al Jazeera, use it; otherwise use fallback
    const news = alJazeeraNews.length > 0 ? alJazeeraNews : FALLBACK_NEWS;
    
    // Sort by date (newest first)
    news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({ 
      news,
      source: alJazeeraNews.length > 0 ? 'aljazeera' : 'fallback',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in news API route:', error);
    return NextResponse.json({ 
      news: FALLBACK_NEWS,
      source: 'fallback',
      timestamp: new Date().toISOString()
    });
  }
}