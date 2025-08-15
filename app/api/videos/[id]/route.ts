import { NextRequest, NextResponse } from 'next/server';
import { videoService } from '@/lib/videoService';
import { checkRateLimit, RateLimitPresets } from '@/lib/middleware/rateLimiting';
import { validateVideoData, sanitizeVideoData } from '@/lib/middleware/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, RateLimitPresets.lenient);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: RateLimitPresets.lenient.message || 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;

    // Check if ID is numeric (database ID) or string (video_id)
    const isNumericId = /^\d+$/.test(id);
    
    let video;
    if (isNumericId) {
      // This would require a new method in VideoService for fetching by database ID
      return NextResponse.json(
        {
          success: false,
          error: 'Fetching by database ID not implemented'
        },
        { status: 501 }
      );
    } else {
      // Fetch by YouTube video ID
      video = await videoService.getVideoById(id);
    }

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          error: 'Video not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video
    });

  } catch (error) {
    console.error('Error in GET /api/videos/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, RateLimitPresets.standard);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: RateLimitPresets.standard.message || 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate that ID is numeric (database ID)
    const databaseId = parseInt(id);
    if (isNaN(databaseId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid video ID'
        },
        { status: 400 }
      );
    }

    // Validate video data
    const validation = validateVideoData(body, false); // false = not required for updates
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
    const sanitizedData = sanitizeVideoData(body);

    // Update the video
    const video = await videoService.updateVideo(databaseId, sanitizedData);

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update video or video not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video
    });

  } catch (error) {
    console.error('Error in PUT /api/videos/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, RateLimitPresets.strict);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: RateLimitPresets.strict.message || 'Too many requests' },
        { status: 429 }
      );
    }

    const { id } = await params;

    // Validate that ID is numeric (database ID)
    const databaseId = parseInt(id);
    if (isNaN(databaseId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid video ID'
        },
        { status: 400 }
      );
    }

    // Delete the video (soft delete)
    const success = await videoService.deleteVideo(databaseId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete video or video not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/videos/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}