import { NextRequest, NextResponse } from 'next/server';

interface StreamData {
  id: string;
  title: string;
  description: string;
  isLive: boolean;
  viewerCount: number;
  startTime: string;
  duration: number;
  quality: string;
  streamKey: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  streamerId: string;
  streamerName: string;
  streamerAvatar: string;
}

// In-memory storage for demo purposes
let streams: StreamData[] = [
  {
    id: 'stream-1',
    title: 'Live Gaming Session - Building Apps',
    description: 'Join me as I build a live streaming platform from scratch!',
    isLive: true,
    viewerCount: 42,
    startTime: new Date().toISOString(),
    duration: 0,
    quality: '1080p',
    streamKey: 'sk_live_abc123def456',
    thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8d27c6d8-5258-4af2-921f-167af0173728.png',
    category: 'Technology',
    tags: ['coding', 'webdev', 'live'],
    streamerId: 'user-1',
    streamerName: 'TechStreamer',
    streamerAvatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/71bcb9d7-9588-42b4-a79a-aa39000eb858.png'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const streamerId = searchParams.get('streamerId');
    const status = searchParams.get('status');

    let filteredStreams = streams;

    if (streamerId) {
      filteredStreams = filteredStreams.filter(stream => stream.streamerId === streamerId);
    }

    if (status === 'live') {
      filteredStreams = filteredStreams.filter(stream => stream.isLive);
    }

    return NextResponse.json({
      success: true,
      streams: filteredStreams,
      total: filteredStreams.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch streams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, tags, streamerId, streamerName, streamerAvatar } = body;

    if (!title || !streamerId) {
      return NextResponse.json(
        { success: false, error: 'Title and streamer ID are required' },
        { status: 400 }
      );
    }

    const newStream: StreamData = {
      id: `stream-${Date.now()}`,
      title,
      description: description || '',
      isLive: false,
      viewerCount: 0,
      startTime: new Date().toISOString(),
      duration: 0,
      quality: '1080p',
      streamKey: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      thumbnailUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3c6edb2c-90c9-45d8-91cd-e4060d3b8f80.png',
      category: category || 'General',
      tags: tags || [],
      streamerId,
      streamerName: streamerName || 'Anonymous',
      streamerAvatar: streamerAvatar || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5a7b319d-711b-419c-827a-a1ce2a84dd96.png'
    };

    streams.push(newStream);

    return NextResponse.json({
      success: true,
      stream: newStream,
      message: 'Stream created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { streamId, action, ...updateData } = body;

    if (!streamId) {
      return NextResponse.json(
        { success: false, error: 'Stream ID is required' },
        { status: 400 }
      );
    }

    const streamIndex = streams.findIndex(stream => stream.id === streamId);
    if (streamIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Stream not found' },
        { status: 404 }
      );
    }

    const stream = streams[streamIndex];

    if (action === 'start') {
      stream.isLive = true;
      stream.startTime = new Date().toISOString();
      stream.viewerCount = Math.floor(Math.random() * 50) + 1;
    } else if (action === 'stop') {
      stream.isLive = false;
      stream.duration = Date.now() - new Date(stream.startTime).getTime();
      stream.viewerCount = 0;
    } else if (action === 'update') {
      Object.assign(stream, updateData);
    }

    streams[streamIndex] = stream;

    return NextResponse.json({
      success: true,
      stream,
      message: `Stream ${action}ed successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update stream' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const streamId = searchParams.get('streamId');

    if (!streamId) {
      return NextResponse.json(
        { success: false, error: 'Stream ID is required' },
        { status: 400 }
      );
    }

    const streamIndex = streams.findIndex(stream => stream.id === streamId);
    if (streamIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Stream not found' },
        { status: 404 }
      );
    }

    streams.splice(streamIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Stream deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete stream' },
      { status: 500 }
    );
  }
}