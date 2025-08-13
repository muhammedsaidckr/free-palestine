export interface StatisticsData {
  casualties: number;
  injured: number;
  displaced_percentage: number;
  aid_packages: number;
  source_name?: string;
  source_url?: string;
  last_updated?: string;
}

export class StatisticsService {
  private static instance: StatisticsService;
  private cache: { data: StatisticsData; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): StatisticsService {
    if (!StatisticsService.instance) {
      StatisticsService.instance = new StatisticsService();
    }
    return StatisticsService.instance;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  public async getStatistics(): Promise<StatisticsData> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.data;
    }

    try {
      const response = await fetch('/api/statistics');
      
      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let statistics: StatisticsData;
      
      if (data.statistics) {
        statistics = {
          casualties: data.statistics.casualties,
          injured: data.statistics.injured,
          displaced_percentage: data.statistics.displaced_percentage,
          aid_packages: data.statistics.aid_packages,
          source_name: data.statistics.source_name,
          source_url: data.statistics.source_url,
          last_updated: data.statistics.last_updated
        };
      } else if (data.fallback) {
        statistics = data.fallback;
      } else {
        throw new Error('No statistics data in response');
      }

      // Cache the result
      this.cache = { data: statistics, timestamp: Date.now() };
      
      console.log('Fetched latest statistics from database');
      return statistics;
    } catch (error) {
      console.error('Error fetching statistics from API:', error);
      
      // Fallback to default statistics
      const fallbackStats: StatisticsData = {
        casualties: 58573,
        injured: 139607,
        displaced_percentage: 90,
        aid_packages: 45000,
        source_name: 'Gaza Health Ministry',
        last_updated: new Date().toISOString()
      };
      
      // Cache fallback data briefly
      this.cache = { data: fallbackStats, timestamp: Date.now() };
      
      return fallbackStats;
    }
  }

  public clearCache(): void {
    this.cache = null;
  }
}

export const statisticsService = StatisticsService.getInstance();