import { NextRequest, NextResponse } from 'next/server';
import { withMiddleware, RateLimits } from '../../../lib/middleware';

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

function createId(title: string, source: string, date?: string): string {
  // Use crypto.subtle for base64 encoding in Cloudflare Workers
  const encoder = new TextEncoder();
  const timestamp = date || new Date().toISOString();
  const uniqueString = `${title}-${source}-${timestamp}`;
  const data = encoder.encode(uniqueString);
  return Array.from(data)
    .map(byte => byte.toString(36))
    .join('')
    .substring(0, 16);
}

async function fetchMiddleEastEyeRSS(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://www.middleeasteye.net/rss.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Middle East Eye RSS fetch failed: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    console.log('Middle East Eye RSS length:', xml.length);

    const itemPattern = /<item>([\s\S]*?)<\/item>/g;
    const articles = [];
    let match;

    while ((match = itemPattern.exec(xml)) !== null && articles.length < 10) {
      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                          itemXml.match(/<title>(.*?)<\/title>/);
      if (!titleMatch) continue;
      
      const title = titleMatch[1].trim();
      
      // Filter for Palestine-related content
      if (!title.toLowerCase().includes('gaza') && 
          !title.toLowerCase().includes('palestine') && 
          !title.toLowerCase().includes('israel') &&
          !title.toLowerCase().includes('west bank') &&
          !title.toLowerCase().includes('filistin')) {
        continue;
      }
      
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                        itemXml.match(/<description>(.*?)<\/description>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      
      const summary = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : title.substring(0, 150) + '...';
      const url = linkMatch ? linkMatch[1].trim() : 'https://www.middleeasteye.net';
      const dateStr = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

      articles.push({
        id: createId(title, 'Middle East Eye', dateStr),
        title,
        summary,
        content: summary,
        category: 'palestine' as const,
        date: new Date(dateStr).toISOString().split('T')[0],
        timeAgo: formatTimeAgo(dateStr),
        source: 'Middle East Eye',
        url
      });
    }

    console.log(`Extracted ${articles.length} Palestine articles from Middle East Eye`);
    return articles;
  } catch (error) {
    console.error('Error fetching Middle East Eye RSS:', error);
    return [];
  }
}

async function fetchTRTHaberRSS(): Promise<NewsItem[]> {
  try {
    const response = await fetch('https://www.trthaber.com/dunya_articles.rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`TRT Haber RSS fetch failed: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    console.log('TRT Haber RSS length:', xml.length);

    const itemPattern = /<item>([\s\S]*?)<\/item>/g;
    const articles = [];
    let match;

    while ((match = itemPattern.exec(xml)) !== null && articles.length < 10) {
      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || 
                          itemXml.match(/<title>(.*?)<\/title>/);
      if (!titleMatch) continue;
      
      const title = titleMatch[1].trim();
      
      // Filter for Palestine-related content (Turkish keywords)
      if (!title.toLowerCase().includes('gazze') && 
          !title.toLowerCase().includes('filistin') && 
          !title.toLowerCase().includes('israel') &&
          !title.toLowerCase().includes('batı şeria') &&
          !title.toLowerCase().includes('palestine') &&
          !title.toLowerCase().includes('gaza')) {
        continue;
      }
      
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                        itemXml.match(/<description>(.*?)<\/description>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      
      const summary = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : title.substring(0, 150) + '...';
      const url = linkMatch ? linkMatch[1].trim() : 'https://www.trthaber.com';
      const dateStr = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

      articles.push({
        id: createId(title, 'TRT Haber', dateStr),
        title,
        summary,
        content: summary,
        category: title.toLowerCase().includes('türkiye') ? 'turkey' as const : 'palestine' as const,
        date: new Date(dateStr).toISOString().split('T')[0],
        timeAgo: formatTimeAgo(dateStr),
        source: 'TRT Haber',
        url
      });
    }

    console.log(`Extracted ${articles.length} Palestine articles from TRT Haber`);
    return articles;
  } catch (error) {
    console.error('Error fetching TRT Haber RSS:', error);
    return [];
  }
}

async function fetchNewsWithFallback(): Promise<NewsItem[]> {
  const sources = [
    fetchTRTHaberRSS,
    fetchMiddleEastEyeRSS,
  ];

  for (const fetchFunction of sources) {
    try {
      const articles = await fetchFunction();
      if (articles.length > 0) {
        return articles;
      }
    } catch (error) {
      console.error(`Source failed:`, error);
      continue;
    }
  }

  return [];
}

// Fallback news data
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

async function handleGetNews(...args: unknown[]) {
  const [] = args as [NextRequest];
  try {
    // Try to fetch from various sources
    const fetchedNews = await fetchNewsWithFallback();
    
    // If we got news from external sources, use it; otherwise use fallback
    const news = fetchedNews.length > 0 ? fetchedNews : FALLBACK_NEWS;
    
    // Sort by date (newest first)
    news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({ 
      news,
      source: fetchedNews.length > 0 ? 'external' : 'fallback',
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

export const GET = withMiddleware({
  rateLimit: RateLimits.news
})(handleGetNews);