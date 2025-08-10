'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { boycottItems, boycottCategories, severityLevels, BoycottItem } from '@/data/boycottData';

interface BoycottListProps {
  className?: string;
}

export const BoycottList: React.FC<BoycottListProps> = ({ className = '' }) => {
  const { language } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return boycottItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.reason[language].toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSeverity = selectedSeverity === 'all' || item.severity === selectedSeverity;
      
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [searchTerm, selectedCategory, selectedSeverity, language]);

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const getSeverityBadgeColor = (severity: BoycottItem['severity']) => {
    return severityLevels[severity].color;
  };

  const getCategoryIcon = (category: BoycottItem['category']) => {
    const icons = {
      technology: '💻',
      food: '🍔',
      fashion: '👕',
      finance: '💰',
      entertainment: '🎬',
      automotive: '🚗',
      other: '📦'
    };
    return icons[category] || icons.other;
  };

  return (
    <div className={`${className}`}>
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'tr' ? 'Marka adı veya açıklama ara...' : 'Search brand name or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'tr' ? 'Kategori' : 'Category'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
              >
                <option value="all">{language === 'tr' ? 'Tüm Kategoriler' : 'All Categories'}</option>
                {Object.entries(boycottCategories).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'tr' ? 'Öncelik Düzeyi' : 'Priority Level'}
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
              >
                <option value="all">{language === 'tr' ? 'Tüm Seviyeler' : 'All Levels'}</option>
                {Object.entries(severityLevels).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredItems.length} {language === 'tr' ? 'marka bulundu' : 'brands found'}
        </div>
      </div>

      {/* Boycott Items List */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          const isExpanded = expandedItem === item.id;
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Item Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleItemExpansion(item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-3xl">
                      {getCategoryIcon(item.category)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.name}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityBadgeColor(item.severity)}`}>
                          {severityLevels[item.severity][language]}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {boycottCategories[item.category][language]}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {item.reason[language]}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`ml-4 flex-shrink-0 transform transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                  <div className="pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {language === 'tr' ? 'Alternatif Markalar:' : 'Alternative Brands:'}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {item.alternatives.map((alternative, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <h5 className="font-medium text-[#007A3D] mb-2">
                            {alternative.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {alternative.description[language]}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Sources */}
                    {item.sources.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">
                          {language === 'tr' ? 'Kaynaklar:' : 'Sources:'}
                        </h5>
                        <div className="space-y-1">
                          {item.sources.map((source, index) => (
                            <a
                              key={index}
                              href={source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline block"
                            >
                              {source}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Last Updated */}
                    <div className="text-xs text-gray-500">
                      {language === 'tr' ? 'Son güncelleme: ' : 'Last updated: '}
                      {new Date(item.lastUpdated).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {language === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
          </h3>
          <p className="text-gray-500">
            {language === 'tr' 
              ? 'Arama kriterlerinizi değiştirip tekrar deneyin' 
              : 'Try changing your search criteria and try again'
            }
          </p>
        </div>
      )}
    </div>
  );
};