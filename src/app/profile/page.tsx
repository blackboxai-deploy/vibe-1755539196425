"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  User, 
  Camera, 
  Settings, 
  Save, 
  Upload, 
  Eye, 
  Clock, 
  Users, 
  Video,
  Bell,
  Shield,
  Monitor,
  Mic,
  Volume2
} from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  followerCount: number;
  streamCount: number;
  totalViewTime: number;
  joinDate: string;
}

interface StreamSettings {
  defaultQuality: string;
  enableChat: boolean;
  enableNotifications: boolean;
  autoRecord: boolean;
  streamTitle: string;
  streamCategory: string;
  isPrivate: boolean;
  maxViewers: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "user_123",
    username: "streamer_pro",
    displayName: "Pro Streamer",
    email: "streamer@example.com",
    bio: "Welcome to my stream! I love gaming and chatting with viewers.",
    avatar: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/34304fa1-1cfe-4d04-a597-c07f0b4011c0.png",
    isVerified: true,
    followerCount: 1247,
    streamCount: 89,
    totalViewTime: 15420,
    joinDate: "2023-06-15"
  });

  const [settings, setSettings] = useState<StreamSettings>({
    defaultQuality: "1080p",
    enableChat: true,
    enableNotifications: true,
    autoRecord: false,
    streamTitle: "Live Stream",
    streamCategory: "Just Chatting",
    isPrivate: false,
    maxViewers: 100
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsUpdate = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const formatViewTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar} alt={profile.displayName} />
          <AvatarFallback>{profile.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{profile.displayName}</h1>
            {profile.isVerified && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">@{profile.username}</p>
          <div className="flex gap-6 mt-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-semibold">{profile.followerCount.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">followers</span>
            </div>
            <div className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span className="font-semibold">{profile.streamCount}</span>
              <span className="text-sm text-muted-foreground">streams</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{formatViewTime(profile.totalViewTime)}</span>
              <span className="text-sm text-muted-foreground">streamed</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="streaming" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Streaming
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your public profile and personal information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar} alt={profile.displayName} />
                  <AvatarFallback>{profile.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell viewers about yourself..."
                />
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleProfileUpdate} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
              <CardDescription>
                Configure your default streaming preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streamTitle">Default Stream Title</Label>
                  <Input
                    id="streamTitle"
                    value={settings.streamTitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, streamTitle: e.target.value }))}
                    placeholder="Enter default stream title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Default Category</Label>
                  <Select
                    value={settings.streamCategory}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, streamCategory: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Just Chatting">Just Chatting</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Default Quality</Label>
                <Select
                  value={settings.defaultQuality}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, defaultQuality: value }))}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                    <SelectItem value="1440p">1440p 2K</SelectItem>
                    <SelectItem value="2160p">2160p 4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Stream Features</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Label htmlFor="enableChat">Enable Chat</Label>
                  </div>
                  <Switch
                    id="enableChat"
                    checked={settings.enableChat}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableChat: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <Label htmlFor="autoRecord">Auto-record Streams</Label>
                  </div>
                  <Switch
                    id="autoRecord"
                    checked={settings.autoRecord}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRecord: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <Label htmlFor="isPrivate">Private Stream</Label>
                  </div>
                  <Switch
                    id="isPrivate"
                    checked={settings.isPrivate}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isPrivate: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleSettingsUpdate} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="notifications">Enable Notifications</Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Privacy & Security</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="maxViewers">Maximum Viewers</Label>
                  <Select
                    value={settings.maxViewers.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, maxViewers: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 viewers</SelectItem>
                      <SelectItem value="100">100 viewers</SelectItem>
                      <SelectItem value="250">250 viewers</SelectItem>
                      <SelectItem value="500">500 viewers</SelectItem>
                      <SelectItem value="1000">1000 viewers</SelectItem>
                      <SelectItem value="-1">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-800 mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>

              <Button onClick={handleSettingsUpdate} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}