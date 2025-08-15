import { NextRequest, NextResponse } from 'next/server';
import { withMiddleware, RateLimits } from '../../../lib/middleware';
import { getLatestStatistics } from '../../../lib/database';

async function handleGetStatistics(...args: unknown[]) {
  const [_request] = args as [NextRequest];
  
  try {
    const statistics = await getLatestStatistics();
    
    if (!statistics) {
      return NextResponse.json({
        error: 'No statistics available',
        fallback: {
          casualties: 58573,
          injured: 139607,
          displaced_percentage: 90,
          aid_packages: 45000,
          source_name: 'Gaza Health Ministry',
          last_updated: new Date().toISOString()
        }
      }, { status: 404 });
    }
    
    return NextResponse.json({
      statistics,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch statistics',
      fallback: {
        casualties: 58573,
        injured: 139607,
        displaced_percentage: 90,
        aid_packages: 45000,
        source_name: 'Gaza Health Ministry',
        last_updated: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

export const GET = withMiddleware({
  rateLimit: RateLimits.news // Reuse the news rate limit
})(handleGetStatistics);