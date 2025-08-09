'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/components/I18nProvider';
import { timelineEvents, TimelineEvent } from '@/lib/timelineData';

interface TimelineProps {
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ className = '' }) => {
  const { language } = useI18n();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<string[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const eventId = entry.target.getAttribute('data-event-id');
            if (eventId && !visibleEvents.includes(eventId)) {
              setVisibleEvents(prev => [...prev, eventId]);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const eventElements = timelineRef.current?.querySelectorAll('.timeline-event');
    eventElements?.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, [visibleEvents]);

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const getEventTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'tragedy':
        return 'bg-[#CE1126] border-[#CE1126]';
      case 'resistance':
        return 'bg-[#007A3D] border-[#007A3D]';
      case 'international':
        return 'bg-blue-600 border-blue-600';
      case 'current':
        return 'bg-orange-600 border-orange-600';
      default:
        return 'bg-gray-600 border-gray-600';
    }
  };

  const getEventTypeLabel = (type: TimelineEvent['type']) => {
    const labels = {
      tragedy: { tr: 'Trajedi', en: 'Tragedy' },
      resistance: { tr: 'Direniş', en: 'Resistance' },
      international: { tr: 'Diplomatik', en: 'Diplomatic' },
      current: { tr: 'Güncel', en: 'Current' }
    };
    return labels[type][language];
  };

  return (
    <div className={`relative ${className}`} ref={timelineRef}>
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CE1126] via-[#007A3D] to-orange-600"></div>
      
      {/* Timeline Events */}
      <div className="space-y-12">
        {timelineEvents.map((event, index) => {
          const isVisible = visibleEvents.includes(event.id);
          const isExpanded = expandedEvent === event.id;
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={event.id}
              className={`timeline-event relative flex items-start transition-all duration-700 transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
              data-event-id={event.id}
            >
              {/* Timeline Dot */}
              <div className={`relative z-10 w-6 h-6 rounded-full border-4 ${getEventTypeColor(event.type)} bg-white shadow-lg flex-shrink-0 transition-transform duration-300 hover:scale-110`}>
                <div className={`absolute inset-1 rounded-full ${getEventTypeColor(event.type)}`}></div>
              </div>
              
              {/* Event Content */}
              <div className={`ml-8 flex-1 ${isEven ? 'lg:ml-8' : 'lg:mr-8 lg:ml-0 lg:text-right'}`}>
                <div
                  className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                    isExpanded ? 'ring-2 ring-offset-2 ring-[#CE1126]' : ''
                  }`}
                  onClick={() => toggleEventExpansion(event.id)}
                >
                  {/* Event Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getEventTypeColor(event.type)}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                      <span className="text-2xl font-bold text-[#CE1126]">{event.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {event.title[language]}
                    </h3>
                    
                    <p className={`text-gray-600 leading-relaxed transition-all duration-300 ${
                      isExpanded ? 'line-clamp-none' : 'line-clamp-2'
                    }`}>
                      {event.description[language]}
                    </p>
                  </div>
                  
                  {/* Expansion Indicator */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full border-2 border-[#CE1126] flex items-center justify-center transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-3 h-3 text-[#CE1126]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Details (Expandable) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                      <div className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-800">
                              {language === 'tr' ? 'Yıl:' : 'Year:'}
                            </span>
                            <span className="ml-2">{event.year}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">
                              {language === 'tr' ? 'Kategori:' : 'Category:'}
                            </span>
                            <span className="ml-2">{getEventTypeLabel(event.type)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h4 className="font-bold text-gray-900 mb-4">
          {language === 'tr' ? 'Kategori Açıklaması:' : 'Category Legend:'}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#CE1126]"></div>
            <span className="text-sm text-gray-600">{language === 'tr' ? 'Trajedi' : 'Tragedy'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#007A3D]"></div>
            <span className="text-sm text-gray-600">{language === 'tr' ? 'Direniş' : 'Resistance'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="text-sm text-gray-600">{language === 'tr' ? 'Diplomatik' : 'Diplomatic'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-600"></div>
            <span className="text-sm text-gray-600">{language === 'tr' ? 'Güncel' : 'Current'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};