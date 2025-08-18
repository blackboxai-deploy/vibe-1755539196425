import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  isStreamer: boolean;
  createdAt: Date;
  streamKey?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Simple in-memory storage for demo purposes
// In production, use a proper database
const users = new Map<string, User>();
const sessions = new Map<string, AuthSession>();

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function generateStreamKey(): string {
  return 'sk_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

export function hashPassword(password: string): string {
  // Simple hash for demo - use bcrypt in production
  return Buffer.from(password).toString('base64');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createUser(userData: {
  username: string;
  email: string;
  password: string;
  displayName: string;
  isStreamer?: boolean;
}): User {
  const userId = generateId();
  const user: User = {
    id: userId,
    username: userData.username,
    email: userData.email,
    displayName: userData.displayName,
    isStreamer: userData.isStreamer || false,
    createdAt: new Date(),
    streamKey: userData.isStreamer ? generateStreamKey() : undefined,
  };

  users.set(userId, user);
  users.set(userData.email, user); // Also store by email for login
  
  return user;
}

export function findUserByEmail(email: string): User | null {
  return users.get(email) || null;
}

export function findUserById(id: string): User | null {
  return users.get(id) || null;
}

export function createSession(user: User): AuthSession {
  const token = generateId();
  const session: AuthSession = {
    user,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };

  sessions.set(token, session);
  return session;
}

export function getSession(token: string): AuthSession | null {
  const session = sessions.get(token);
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    sessions.delete(token);
    return null;
  }

  return session;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
  try {
    let token: string | undefined;

    if (request) {
      // Server-side: get from request headers or cookies
      token = request.headers.get('authorization')?.replace('Bearer ', '') ||
              request.cookies.get('auth-token')?.value;
    } else {
      // Client-side: get from cookies
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }

    if (!token) return null;

    const session = getSession(token);
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function setAuthCookie(token: string): string {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return `auth-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires.toUTCString()}`;
}

export function clearAuthCookie(): string {
  return 'auth-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function requireAuth(user: User | null): User {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireStreamer(user: User | null): User {
  const authenticatedUser = requireAuth(user);
  if (!authenticatedUser.isStreamer) {
    throw new Error('Streamer privileges required');
  }
  return authenticatedUser;
}

// Initialize with demo users
export function initializeDemoUsers(): void {
  if (users.size === 0) {
    // Create demo streamer
    createUser({
      username: 'demo_streamer',
      email: 'streamer@demo.com',
      password: 'password123',
      displayName: 'Demo Streamer',
      isStreamer: true,
    });

    // Create demo viewer
    createUser({
      username: 'demo_viewer',
      email: 'viewer@demo.com',
      password: 'password123',
      displayName: 'Demo Viewer',
      isStreamer: false,
    });
  }
}

// Call initialization
initializeDemoUsers();