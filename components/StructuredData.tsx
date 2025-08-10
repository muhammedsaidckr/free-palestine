import Script from 'next/script'

interface ArticleData {
  title: string
  description: string
  datePublished?: string
  dateModified?: string
  url?: string
  [key: string]: unknown
}

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'article'
  data?: ArticleData
}

export function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    }

    if (type === 'website') {
      return {
        ...baseData,
        '@type': 'WebSite',
        name: 'Özgür Filistin - Free Palestine Türkiye',
        description: 'Türkiye\'den Filistin\'e destek. Filistin için birlikte duralım. Bilgilendirme, farkındalık ve dayanışma platformu.',
        url: 'https://ozgurfilistin.tr',
        inLanguage: ['tr', 'en'],
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://ozgurfilistin.tr/haberler?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Özgür Filistin Türkiye',
          url: 'https://ozgurfilistin.tr',
          logo: {
            '@type': 'ImageObject',
            url: 'https://ozgurfilistin.tr/logo.svg',
            width: 200,
            height: 100
          },
          sameAs: [
            'https://instagram.com/ozgurfilistin',
            'https://twitter.com/ozgurfilistin'
          ]
        }
      }
    }

    if (type === 'organization') {
      return {
        ...baseData,
        '@type': 'Organization',
        name: 'Özgür Filistin Türkiye',
        alternateName: 'Free Palestine Turkey',
        url: 'https://ozgurfilistin.tr',
        logo: {
          '@type': 'ImageObject',
          url: 'https://ozgurfilistin.tr/logo.svg',
          width: 200,
          height: 100
        },
        description: 'Türkiye\'den Filistin\'e destek veren sivil dayanışma platformu',
        foundingDate: '2023',
        foundingLocation: {
          '@type': 'Country',
          name: 'Turkey'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Turkey'
        },
        sameAs: [
          'https://instagram.com/ozgurfilistin',
          'https://twitter.com/ozgurfilistin'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'info@ozgurfilistin.tr',
          contactType: 'General Inquiry'
        }
      }
    }

    if (type === 'article' && data) {
      const { title, description, datePublished, dateModified, url, ...otherData } = data
      return {
        ...baseData,
        '@type': 'Article',
        headline: title,
        description: description,
        author: {
          '@type': 'Organization',
          name: 'Özgür Filistin Türkiye'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Özgür Filistin Türkiye',
          logo: {
            '@type': 'ImageObject',
            url: 'https://ozgurfilistin.tr/logo.svg'
          }
        },
        datePublished: datePublished || new Date().toISOString(),
        dateModified: dateModified || new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url || 'https://ozgurfilistin.tr'
        },
        ...otherData
      }
    }

    return baseData
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
}