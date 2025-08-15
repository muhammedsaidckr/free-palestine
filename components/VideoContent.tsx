'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  category: 'documentary' | 'news' | 'testimony' | 'solidarity' | 'educational';
  duration?: string;
  publishedAt: string;
}

interface VideoContentProps {
  videos: VideoItem[];
  title?: string;
  subtitle?: string;
  showCategories?: boolean;
  maxVideos?: number;
  className?: string;
}

export default function VideoContent({ 
  videos, 
  title = "Video İçerikleri", 
  subtitle = "Filistin konusunda bilinçlendirici video içerikleri",
  showCategories = true,
  maxVideos,
  className = ""
}: VideoContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const categories = [
    { id: 'all', label: 'Tümü', color: 'text-gray-600' },
    { id: 'documentary', label: 'Belgesel', color: 'text-blue-600' },
    { id: 'news', label: 'Haber', color: 'text-red-600' },
    { id: 'testimony', label: 'Tanıklık', color: 'text-purple-600' },
    { id: 'solidarity', label: 'Dayanışma', color: 'text-green-600' },
    { id: 'educational', label: 'Eğitici', color: 'text-orange-600' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);
  
  const displayVideos = maxVideos 
    ? filteredVideos.slice(0, maxVideos) 
    : filteredVideos;

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.label : 'Genel';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'text-gray-600';
  };

  const openVideoModal = async (video: VideoItem) => {
    setSelectedVideo(video);
    
    // Increment view count when video is opened
    try {
      await fetch(`/api/videos/${video.videoId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return '';
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {showCategories && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#CE1126] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openVideoModal(video)}
            >
              <div className="relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-[#CE1126]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className={`text-sm font-medium mb-2 ${getCategoryColor(video.category)}`}>
                  {getCategoryLabel(video.category)}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{video.description}</p>
                <div className="text-xs text-gray-400">
                  {new Date(video.publishedAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Bu kategoride henüz video bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={closeVideoModal}>
          <div className="relative w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <div className={`text-sm font-medium mb-2 ${getCategoryColor(selectedVideo.category)}`}>
                  {getCategoryLabel(selectedVideo.category)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-600">{selectedVideo.description}</p>
                <div className="text-sm text-gray-400 mt-4">
                  Yayınlanma: {new Date(selectedVideo.publishedAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}