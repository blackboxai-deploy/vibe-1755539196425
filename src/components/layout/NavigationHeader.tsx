"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  Play,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { useState } from 'react';

interface NavigationHeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isStreaming?: boolean;
  };
  onSignOut?: () => void;
}

export function NavigationHeader({ user, onSignOut }: NavigationHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      href: '/',
      label: 'Home',
      icon: Play,
      active: pathname === '/'
    },
    {
      href: '/stream',
      label: 'Go Live',
      icon: Video,
      active: pathname === '/stream',
      highlight: true
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      active: pathname === '/dashboard',
      requiresAuth: true
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Radio className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">StreamLive</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  item.active
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.highlight && (
                  <Badge variant="secondary" className="ml-1">
                    Live
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Streaming Status */}
              {user.isStreaming && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-500">LIVE</span>
                </div>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                    item.active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <Badge variant="secondary" className="ml-auto">
                      Live
                    </Badge>
                  )}
                </Link>
              );
            })}
            
            {!user && (
              <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}