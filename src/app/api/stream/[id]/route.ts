import { NextRequest, NextResponse } from 'next/server';

// Mock database for streams
const streams = new Map<string, {
  id: string;
  title: string;
  description: string;
  streamerId: string;
  streamerName: string;
  isLive: boolean;
  viewerCount: number;
  startTime: string;
  endTime?: string;
  category: string;
  thumbnailUrl: string;
  streamUrl?: string;
  chatEnabled: boolean;
  recordingEnabled: boolean;
  quality: string;
  tags: string[];
  duration?: number;
  maxViewers: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}>();

// Initialize with sample data
if (streams.size === 0) {
  streams.set('stream-1', {
    id: 'stream-1',
    title: 'Live Coding Session - Building React App',
    description: 'Join me as I build a React application from scratch with TypeScript and modern tools.',
    streamerId: 'user-1',
    streamerName: 'CodeMaster',
    isLive: true,
    viewerCount: 42,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    category: 'Programming',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5799b6c1-34ec-442c-acef-a0677fba2a34.png',
    streamUrl: 'stream-url-placeholder',
    chatEnabled: true,
    recordingEnabled: true,
    quality: '1080p',
    tags: ['react', 'typescript', 'coding', 'tutorial'],
    maxViewers: 67,
    totalViews: 156,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString()
  });

  streams.set('stream-2', {
    id: 'stream-2',
    title: 'Gaming Stream - Indie Game Showcase',
    description: 'Exploring the latest indie games and having fun with the community!',
    streamerId: 'user-2',
    streamerName: 'GameExplorer',
    isLive: false,
    viewerCount: 0,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 82800000).toISOString(),
    category: 'Gaming',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e7f81219-4d62-49b3-8342-c3c18ffe35ce.png',
    chatEnabled: true,
    recordingEnabled: true,
    quality: '720p',
    tags: ['gaming', 'indie', 'entertainment'],
    duration: 3600,
    maxViewers: 89,
    totalViews: 234,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 82800000).toISOString()
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const stream = streams.get(id);

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    // Simulate real-time viewer count updates for live streams
    if (stream.isLive) {
      const variance = Math.floor(Math.random() * 10) - 5;
      stream.viewerCount = Math.max(0, stream.viewerCount + variance);
      stream.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      data: stream
    });
  } catch (error) {
    console.error('Error fetching stream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const stream = streams.get(id);

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    // Update stream properties
    const updatedStream = {
      ...stream,
      ...body,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };

    // Handle special cases for stream state changes
    if (body.isLive !== undefined) {
      if (body.isLive && !stream.isLive) {
        // Starting stream
        updatedStream.startTime = new Date().toISOString();
        updatedStream.viewerCount = 0;
        delete updatedStream.endTime;
      } else if (!body.isLive && stream.isLive) {
        // Ending stream
        updatedStream.endTime = new Date().toISOString();
        updatedStream.duration = Math.floor(
          (new Date().getTime() - new Date(stream.startTime).getTime()) / 1000
        );
        updatedStream.viewerCount = 0;
      }
    }

    streams.set(id, updatedStream);

    return NextResponse.json({
      success: true,
      data: updatedStream,
      message: 'Stream updated successfully'
    });
  } catch (error) {
    console.error('Error updating stream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stream = streams.get(id);

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    // If stream is live, end it before deletion
    if (stream.isLive) {
      stream.isLive = false;
      stream.endTime = new Date().toISOString();
      stream.duration = Math.floor(
        (new Date().getTime() - new Date(stream.startTime).getTime()) / 1000
      );
    }

    streams.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Stream deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting stream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();
    const stream = streams.get(id);

    if (!stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    let updatedStream = { ...stream };

    switch (action) {
      case 'start':
        if (!stream.isLive) {
          updatedStream.isLive = true;
          updatedStream.startTime = new Date().toISOString();
          updatedStream.viewerCount = 0;
          delete updatedStream.endTime;
        }
        break;

      case 'stop':
        if (stream.isLive) {
          updatedStream.isLive = false;
          updatedStream.endTime = new Date().toISOString();
          updatedStream.duration = Math.floor(
            (new Date().getTime() - new Date(stream.startTime).getTime()) / 1000
          );
          updatedStream.viewerCount = 0;
        }
        break;

      case 'increment_viewers':
        if (stream.isLive) {
          updatedStream.viewerCount = stream.viewerCount + 1;
          updatedStream.maxViewers = Math.max(updatedStream.maxViewers, updatedStream.viewerCount);
          updatedStream.totalViews = stream.totalViews + 1;
        }
        break;

      case 'decrement_viewers':
        if (stream.isLive) {
          updatedStream.viewerCount = Math.max(0, stream.viewerCount - 1);
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    updatedStream.updatedAt = new Date().toISOString();
    streams.set(id, updatedStream);

    return NextResponse.json({
      success: true,
      data: updatedStream,
      message: `Stream ${action} completed successfully`
    });
  } catch (error) {
    console.error('Error performing stream action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}