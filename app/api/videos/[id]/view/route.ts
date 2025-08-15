import { NextRequest, NextResponse } from 'next/server';
import { videoService } from '@/lib/videoService';
import { rateLimitMiddleware } from '@/lib/middleware/rateLimiting';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { id } = params;

    // Increment view count for the video
    const success = await videoService.incrementViewCount(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to increment view count'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'View count incremented'
    });

  } catch (error) {
    console.error('Error in POST /api/videos/[id]/view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}