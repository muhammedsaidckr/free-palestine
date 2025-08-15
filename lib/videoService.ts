import { VideoItem } from '@/components/VideoContent';
import { createClient } from '@/lib/supabase/server';

export interface VideoData {
  id: number;
  title: string;
  description: string;
  video_id: string;
  thumbnail_url?: string;
  category: 'documentary' | 'news' | 'testimony' | 'solidarity' | 'educational';
  duration?: string;
  published_at: string;
  view_count: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVideoData {
  title: string;
  description: string;
  video_id: string;
  thumbnail_url?: string;
  category: 'documentary' | 'news' | 'testimony' | 'solidarity' | 'educational';
  duration?: string;
  published_at: string;
  is_featured?: boolean;
  sort_order?: number;
}

export class VideoService {
  // Convert database video to VideoItem format
  private static convertToVideoItem(video: VideoData): VideoItem {
    return {
      id: video.video_id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`,
      videoId: video.video_id,
      category: video.category,
      duration: video.duration,
      publishedAt: video.published_at
    };
  }

  static async getAllVideos(): Promise<VideoItem[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        return this.getFallbackVideos();
      }

      return data.map(this.convertToVideoItem);
    } catch (error) {
      console.error('Error in getAllVideos:', error);
      return this.getFallbackVideos();
    }
  }

  static async getVideosByCategory(category: string): Promise<VideoItem[]> {
    if (category === 'all') {
      return this.getAllVideos();
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos by category:', error);
        return this.getFallbackVideos().filter(v => v.category === category);
      }

      return data.map(this.convertToVideoItem);
    } catch (error) {
      console.error('Error in getVideosByCategory:', error);
      return this.getFallbackVideos().filter(v => v.category === category);
    }
  }

  static async getFeaturedVideos(count: number = 3): Promise<VideoItem[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false })
        .limit(count);

      if (error) {
        console.error('Error fetching featured videos:', error);
        return this.getFallbackVideos().slice(0, count);
      }

      return data.map(this.convertToVideoItem);
    } catch (error) {
      console.error('Error in getFeaturedVideos:', error);
      return this.getFallbackVideos().slice(0, count);
    }
  }

  static async getVideoById(videoId: string): Promise<VideoItem | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('video_id', videoId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching video by ID:', error);
        return null;
      }

      return this.convertToVideoItem(data);
    } catch (error) {
      console.error('Error in getVideoById:', error);
      return null;
    }
  }

  static async createVideo(videoData: CreateVideoData): Promise<VideoData | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          ...videoData,
          thumbnail_url: videoData.thumbnail_url || `https://img.youtube.com/vi/${videoData.video_id}/maxresdefault.jpg`
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating video:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createVideo:', error);
      return null;
    }
  }

  static async updateVideo(id: number, updates: Partial<CreateVideoData>): Promise<VideoData | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating video:', error);
        // Re-throw the error to preserve the original error information
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateVideo:', error);
      throw error;
    }
  }

  static async deleteVideo(id: number): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('videos')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error deleting video:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteVideo:', error);
      return false;
    }
  }

  static async incrementViewCount(videoId: string): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.rpc('increment_video_views', {
        video_id_param: videoId
      });

      if (error) {
        console.error('Error incrementing view count:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
      return false;
    }
  }

  // Fallback data for when database is not available
  private static getFallbackVideos(): VideoItem[] {
    const fallbackData = [
      {
        videoId: 'n_3pkGHmJOs',
        title: 'Filistin Tarihi: Nakba\'dan Günümüze',
        description: 'Filistin halkının yaşadığı tarihi süreç ve Nakba\'nın etkilerini anlatan belgesel.',
        category: 'documentary' as const,
        publishedAt: '2023-10-15',
        duration: 'PT45M30S'
      },
      {
        videoId: 'BT5L4YU_Fl4',
        title: 'Gazze\'den Canlı Tanıklık',
        description: 'Gazze\'de yaşayan bir ailenin gözünden günlük yaşam ve direniş.',
        category: 'testimony' as const,
        publishedAt: '2024-01-20',
        duration: 'PT12M45S'
      },
      {
        videoId: 'Y1NndUlk_nQ',
        title: 'Türkiye\'den Filistin\'e Destek Yürüyüşü',
        description: 'İstanbul\'da düzenlenen Filistin dayanışma yürüyüşünden görüntüler.',
        category: 'solidarity' as const,
        publishedAt: '2024-02-10',
        duration: 'PT8M20S'
      }
    ];

    return fallbackData.map(video => ({
      id: video.videoId,
      title: video.title,
      description: video.description,
      thumbnail: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
      videoId: video.videoId,
      category: video.category,
      duration: video.duration,
      publishedAt: video.publishedAt
    }));
  }

  static async fetchYouTubeData(videoId: string, apiKey?: string): Promise<CreateVideoData | null> {
    if (!apiKey) {
      console.warn('YouTube API key not provided, using fallback data');
      return null;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube data');
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return null;
      }

      const video = data.items[0];
      return {
        title: video.snippet.title,
        description: video.snippet.description,
        video_id: video.id,
        thumbnail_url: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        category: 'news', // Default category, should be determined based on content
        duration: video.contentDetails.duration,
        published_at: video.snippet.publishedAt,
        is_featured: false,
        sort_order: 999
      };
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      return null;
    }
  }

  static async getCategoryStats(): Promise<{[key: string]: number}> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('videos_by_category')
        .select('*');

      if (error) {
        console.error('Error fetching category stats:', error);
        return {};
      }

      const stats: {[key: string]: number} = {};
      data.forEach(item => {
        stats[item.category] = item.video_count;
      });

      return stats;
    } catch (error) {
      console.error('Error in getCategoryStats:', error);
      return {};
    }
  }
}

export const videoService = VideoService;