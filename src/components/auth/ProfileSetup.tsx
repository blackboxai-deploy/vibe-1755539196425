"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Camera, Upload, User, Globe, Lock, Settings } from "lucide-react"

interface ProfileData {
  displayName: string
  username: string
  bio: string
  avatar: string
  category: string
  isPublic: boolean
  allowChat: boolean
  allowRecording: boolean
  streamTitle: string
  streamDescription: string
}

interface ProfileSetupProps {
  onComplete: (profile: ProfileData) => void
  initialData?: Partial<ProfileData>
}

export default function ProfileSetup({ onComplete, initialData }: ProfileSetupProps) {
  const [profile, setProfile] = useState<ProfileData>({
    displayName: initialData?.displayName || "",
    username: initialData?.username || "",
    bio: initialData?.bio || "",
    avatar: initialData?.avatar || "",
    category: initialData?.category || "",
    isPublic: initialData?.isPublic ?? true,
    allowChat: initialData?.allowChat ?? true,
    allowRecording: initialData?.allowRecording ?? false,
    streamTitle: initialData?.streamTitle || "",
    streamDescription: initialData?.streamDescription || ""
  })

  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    "Gaming", "Music", "Art & Creative", "Technology", "Education", 
    "Fitness", "Cooking", "Travel", "Talk Shows", "Entertainment", "Other"
  ]

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        handleInputChange("avatar", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateUsername = () => {
    const name = profile.displayName.toLowerCase().replace(/\s+/g, "")
    const random = Math.floor(Math.random() * 1000)
    handleInputChange("username", `${name}${random}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    onComplete(profile)
    setIsLoading(false)
  }

  const isFormValid = profile.displayName && profile.username && profile.category

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Setup
          </CardTitle>
          <CardDescription>
            Set up your streaming profile to get started with broadcasting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback className="text-lg">
                  {profile.displayName.charAt(0).toUpperCase() || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  placeholder="Your streaming name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="unique_username"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateUsername}
                    disabled={!profile.displayName}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell viewers about yourself and your content..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Streaming Category *</Label>
              <Select value={profile.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your main content category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stream Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Stream Settings
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="streamTitle">Default Stream Title</Label>
                <Input
                  id="streamTitle"
                  value={profile.streamTitle}
                  onChange={(e) => handleInputChange("streamTitle", e.target.value)}
                  placeholder="What will you be streaming?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streamDescription">Default Stream Description</Label>
                <Textarea
                  id="streamDescription"
                  value={profile.streamDescription}
                  onChange={(e) => handleInputChange("streamDescription", e.target.value)}
                  placeholder="Describe what viewers can expect from your streams..."
                  rows={2}
                />
              </div>
            </div>

            {/* Privacy & Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy & Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public Profile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to discover your profile and streams
                    </p>
                  </div>
                  <Switch
                    checked={profile.isPublic}
                    onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Chat</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow viewers to chat during your streams
                    </p>
                  </div>
                  <Switch
                    checked={profile.allowChat}
                    onCheckedChange={(checked) => handleInputChange("allowChat", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Recording</Label>
                    <p className="text-sm text-muted-foreground">
                      Let viewers record clips from your streams
                    </p>
                  </div>
                  <Switch
                    checked={profile.allowRecording}
                    onCheckedChange={(checked) => handleInputChange("allowRecording", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Profile Preview */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-3">Profile Preview</h4>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>
                    {profile.displayName.charAt(0).toUpperCase() || <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{profile.displayName || "Your Name"}</h5>
                    {profile.category && <Badge variant="secondary">{profile.category}</Badge>}
                    {!profile.isPublic && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-sm text-muted-foreground">@{profile.username || "username"}</p>
                  {profile.bio && (
                    <p className="text-sm">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Setting up profile..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}