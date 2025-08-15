import { NextRequest, NextResponse } from 'next/server';
import { videoService } from '@/lib/videoService';
import { rateLimitMiddleware } from '@/lib/middleware/rateLimiting';
import { validateVideoData, sanitizeVideoData } from '@/lib/middleware/validation';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { id } = params;

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
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { id } = params;
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
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { id } = params;

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