import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  isStreamer: boolean;
  createdAt: string;
}

// Mock user database
const users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'demostreamer',
    displayName: 'Demo Streamer',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7c9fa033-7e72-44ce-8b17-a1bd544454ad.png',
    isStreamer: true,
    createdAt: new Date().toISOString()
  }
];

// Mock sessions
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createSession(userId: string): string {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  sessions.set(token, { userId, expiresAt });
  return token;
}

function validateSession(token: string): User | null {
  const session = sessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    if (session) sessions.delete(token);
    return null;
  }
  
  const user = users.find(u => u.id === session.userId);
  return user || null;
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'login': {
        const { email, password } = data as LoginRequest;
        
        if (!email || !password) {
          return NextResponse.json(
            { error: 'Email and password are required' },
            { status: 400 }
          );
        }

        // Mock authentication - in production, verify password hash
        const user = users.find(u => u.email === email);
        if (!user || password !== 'demo123') {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        const sessionToken = createSession(user.id);
        const response = NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            isStreamer: user.isStreamer
          }
        });

        response.cookies.set('session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;
      }

      case 'register': {
        const { email, password, username, displayName } = data as RegisterRequest;
        
        if (!email || !password || !username || !displayName) {
          return NextResponse.json(
            { error: 'All fields are required' },
            { status: 400 }
          );
        }

        // Check if user already exists
        if (users.find(u => u.email === email || u.username === username)) {
          return NextResponse.json(
            { error: 'User already exists' },
            { status: 409 }
          );
        }

        const newUser: User = {
          id: (users.length + 1).toString(),
          email,
          username,
          displayName,
          avatar: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/97534691-398b-41c5-a2a5-497a1ee3d321.png}`,
          isStreamer: true,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        const sessionToken = createSession(newUser.id);

        const response = NextResponse.json({
          user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            displayName: newUser.displayName,
            avatar: newUser.avatar,
            isStreamer: newUser.isStreamer
          }
        });

        response.cookies.set('session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;
      }

      case 'logout': {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;
        
        if (sessionToken) {
          sessions.delete(sessionToken);
        }

        const response = NextResponse.json({ success: true });
        response.cookies.delete('session');
        return response;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = validateSession(sessionToken);
    if (!user) {
      const response = NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
      response.cookies.delete('session');
      return response;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isStreamer: user.isStreamer
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}