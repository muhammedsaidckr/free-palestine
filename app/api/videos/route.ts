import { NextRequest, NextResponse } from 'next/server';
import { videoService, CreateVideoData } from '@/lib/videoService';
import { rateLimitMiddleware } from '@/lib/middleware/rateLimiting';
import { validateVideoData, sanitizeVideoData } from '@/lib/middleware/validation';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let videos;

    if (featured === 'true') {
      const limitNum = limit ? parseInt(limit) : 3;
      videos = await videoService.getFeaturedVideos(limitNum);
    } else if (category) {
      videos = await videoService.getVideosByCategory(category);
    } else {
      videos = await videoService.getAllVideos();
    }

    return NextResponse.json({
      success: true,
      data: videos,
      total: videos.length
    });

  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const body = await request.json();

    // Validate video data
    const validation = validateVideoData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Sanitize the data
    const sanitizedData = sanitizeVideoData(body) as CreateVideoData;

    // Create the video
    const video = await videoService.createVideo(sanitizedData);

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create video'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: video
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in POST /api/videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}