'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VideoData, CreateVideoData } from '@/lib/videoService';
import { createClient } from '@/lib/supabase/client';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown[];
}

export default function VideoAdminPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [user, setUser] = useState<{email: string} | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<CreateVideoData>({
    title: '',
    description: '',
    video_id: '',
    thumbnail_url: '',
    category: 'news',
    duration: '',
    published_at: '',
    is_featured: false,
    sort_order: 0
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchVideos();
      } else {
        router.push('/admin/login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin/login');
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos');
      const result: ApiResponse<VideoData[]> = await response.json();
      
      if (result.success && result.data) {
        // Convert to proper VideoData format since API returns VideoItem format
        const videoData = result.data.map((video: {title: string; description: string; videoId: string; thumbnail: string; category: string; duration: string; publishedAt: string}) => ({
          id: Math.random(), // This would come from the database
          title: video.title,
          description: video.description,
          video_id: video.videoId,
          thumbnail_url: video.thumbnail,
          category: video.category,
          duration: video.duration,
          published_at: video.publishedAt,
          view_count: 0,
          is_featured: false,
          is_active: true,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setVideos(videoData);
      } else {
        setError(result.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Error fetching videos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingVideo ? `/api/videos/${editingVideo.id}` : '/api/videos';
      const method = editingVideo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result: ApiResponse<VideoData> = await response.json();
      
      if (result.success) {
        await fetchVideos(); // Refresh the list
        resetForm();
        setShowAddForm(false);
        setEditingVideo(null);
      } else {
        setError(result.error || 'Failed to save video');
      }
    } catch (err) {
      setError('Error saving video');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu videoyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE'
      });

      const result: ApiResponse<unknown> = await response.json();
      
      if (result.success) {
        await fetchVideos(); // Refresh the list
      } else {
        setError(result.error || 'Failed to delete video');
      }
    } catch (err) {
      setError('Error deleting video');
      console.error('Error:', err);
    }
  };

  const handleEdit = (video: VideoData) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      video_id: video.video_id,
      thumbnail_url: video.thumbnail_url || '',
      category: video.category,
      duration: video.duration || '',
      published_at: video.published_at,
      is_featured: video.is_featured,
      sort_order: video.sort_order
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_id: '',
      thumbnail_url: '',
      category: 'news',
      duration: '',
      published_at: '',
      is_featured: false,
      sort_order: 0
    });
  };

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return url;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE1126] mx-auto mb-4"></div>
          <p className="text-gray-600">Videolar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <span className="text-sm text-gray-500">Video Yönetimi</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hoş geldiniz, {user.email}
              </span>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Ana Sayfa
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Yönetimi</h2>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingVideo(null);
              resetForm();
            }}
            className="bg-[#CE1126] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B00E20] transition-colors"
          >
            Yeni Video Ekle
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingVideo ? 'Video Düzenle' : 'Yeni Video Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'documentary' | 'news' | 'testimony' | 'solidarity' | 'educational' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                    required
                  >
                    <option value="documentary">Belgesel</option>
                    <option value="news">Haber</option>
                    <option value="testimony">Tanıklık</option>
                    <option value="solidarity">Dayanışma</option>
                    <option value="educational">Eğitici</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL veya Video ID
                  </label>
                  <input
                    type="text"
                    value={formData.video_id}
                    onChange={(e) => {
                      const videoId = extractVideoId(e.target.value);
                      setFormData({ ...formData, video_id: videoId });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                    placeholder="https://youtube.com/watch?v=... veya video ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yayın Tarihi</label>
                  <input
                    type="datetime-local"
                    value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Süre (PT15M30S)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                    placeholder="PT15M30S"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                    min="0"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 text-[#CE1126] focus:ring-[#CE1126] border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                    Öne Çıkan
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#CE1126] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B00E20] transition-colors"
                >
                  {editingVideo ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVideo(null);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Videos List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Videolar ({videos.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yayın Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <Image
                            className="h-16 w-24 rounded object-cover"
                            width={96}
                            height={64}
                            src={video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/default.jpg`}
                            alt={video.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">
                            {video.title}
                          </div>
                          <div className="text-sm text-gray-500">{video.video_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {video.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(video.published_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {video.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Öne Çıkan
                          </span>
                        )}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          video.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {video.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}