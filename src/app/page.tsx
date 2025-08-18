'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Users, Clock, Eye, Video, Mic, Settings, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [liveStreams, setLiveStreams] = useState([
    {
      id: '1',
      title: 'Gaming Session - Building in Minecraft',
      streamer: 'StreamerPro',
      viewers: 1247,
      duration: '2h 15m',
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/716e8dc8-2c19-48d6-935d-61cc00e41556.png',
      category: 'Gaming',
      isLive: true
    },
    {
      id: '2',
      title: 'Coding Tutorial - React & Next.js',
      streamer: 'DevMaster',
      viewers: 892,
      duration: '1h 32m',
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5ece27a2-d531-4fd9-bbbc-b86b9ac5975c.png',
      category: 'Technology',
      isLive: true
    },
    {
      id: '3',
      title: 'Music Production Live',
      streamer: 'BeatMaker',
      viewers: 634,
      duration: '45m',
      thumbnail: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b9f07650-ec9f-45d2-82de-d14b5c2dddb8.png',
      category: 'Music',
      isLive: true
    }
  ]);

  useEffect(() => {
    const auth = localStorage.getItem('streamAuth');
    setIsAuthenticated(!!auth);
  }, []);

  const handleStartStreaming = () => {
    if (isAuthenticated) {
      window.location.href = '/stream';
    } else {
      window.location.href = '/auth';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Video className="h-8 w-8 text-purple-500" />
                <span className="text-xl font-bold text-white">StreamLive</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      Profile
                    </Button>
                  </Link>
                  <Button onClick={handleStartStreaming} className="bg-purple-600 hover:bg-purple-700">
                    <Video className="h-4 w-4 mr-2" />
                    Go Live
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost" className="text-white hover:text-purple-300">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Stream Yourself to the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> World</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Create, broadcast, and connect with your audience in real-time. Professional streaming tools made simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleStartStreaming}
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Streaming Now
              </Button>
              <Link href="/watch/demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-slate-600 text-white hover:bg-slate-800">
                  <Eye className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Stream</h2>
          <p className="text-slate-300 text-lg">Professional streaming features built for creators</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Video className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle className="text-white">HD Streaming</CardTitle>
              <CardDescription className="text-slate-300">
                Broadcast in up to 1080p with crystal clear audio quality
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Users className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle className="text-white">Real-time Chat</CardTitle>
              <CardDescription className="text-slate-300">
                Engage with your audience through interactive live chat
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-purple-500 mb-2" />
              <CardTitle className="text-white">Analytics</CardTitle>
              <CardDescription className="text-slate-300">
                Track your performance with detailed streaming analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Live Streams Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Live Now</h2>
          <Link href="/browse">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              View All Streams
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStreams.map((stream) => (
            <Card key={stream.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-colors">
              <div className="relative">
                <img 
                  src={stream.thumbnail} 
                  alt={stream.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-600 hover:bg-red-600 text-white">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    LIVE
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {stream.viewers.toLocaleString()}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cc1e154e-cc3d-43ad-8cf9-c8826cbc4b5d.png}`} />
                    <AvatarFallback>{stream.streamer[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{stream.title}</h3>
                    <p className="text-slate-400 text-sm">{stream.streamer}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {stream.duration}
                      </span>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {stream.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-800/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Streaming?</h2>
            <p className="text-slate-300 text-lg mb-8">Join thousands of creators sharing their passion with the world</p>
            <Button 
              onClick={handleStartStreaming}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
            >
              <Video className="h-5 w-5 mr-2" />
              Create Your Stream
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Video className="h-6 w-6 text-purple-500" />
              <span className="text-lg font-bold text-white">StreamLive</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-slate-500">
            <p>&copy; 2024 StreamLive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}