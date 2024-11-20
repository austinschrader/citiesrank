// src/pages/SettingsPage.tsx
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  Mail,
  Shield,
  Smartphone,
  Globe,
  Users,
  Twitter,
  Instagram,
  Github,
  Facebook,
  Lock,
  Eye,
  BellRing,
  Upload,
} from "lucide-react";

export function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="container max-w-6xl py-8 px-4 mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto p-1 bg-muted/60">
          <TabsTrigger value="account" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex gap-2 items-center">
            <Lock className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="connected" className="flex gap-2 items-center">
            <Globe className="h-4 w-4" />
            Connected Accounts
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile photo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Profile Photo */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h4 className="font-medium">Profile Photo</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload New
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name ?? ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" defaultValue={user?.bio ?? ""} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {[
                  {
                    title: "Comments and Reactions",
                    description: "When someone comments on your lists or reacts to your content",
                    icon: BellRing,
                  },
                  {
                    title: "New Followers",
                    description: "When someone follows your profile",
                    icon: Users,
                  },
                  {
                    title: "List Updates",
                    description: "When places you've saved or listed are updated",
                    icon: Mail,
                  },
                  {
                    title: "Travel Alerts",
                    description: "Important updates about places in your lists",
                    icon: Bell,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <item.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`notify-${index}`} className="font-medium">
                          {item.title}
                        </Label>
                        <Switch id={`notify-${index}`} defaultChecked={index < 2} />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Notification Methods</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label>Email Notifications</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <Label>Push Notifications</Label>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your profile visibility and data preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {[
                  {
                    title: "Profile Visibility",
                    description: "Choose who can see your profile and activity",
                    icon: Eye,
                    options: ["Public", "Followers Only", "Private"],
                  },
                  {
                    title: "List Privacy",
                    description: "Default privacy setting for new lists",
                    icon: Lock,
                    options: ["Public", "Private", "Followers Only"],
                  },
                ].map((setting, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <setting.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{setting.title}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {setting.options.map((option) => (
                        <Button key={option} variant={option === "Public" ? "default" : "outline"} size="sm">
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Data Preferences</h4>
                  <div className="space-y-4">
                    {[
                      "Allow others to find me by email",
                      "Show my location on profile",
                      "Share my lists with search engines",
                      "Allow data collection for personalization",
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Label htmlFor={`pref-${index}`}>{pref}</Label>
                        <Switch id={`pref-${index}`} defaultChecked={index < 2} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connected Accounts */}
        <TabsContent value="connected">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected social media accounts and services.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {[
                  { name: "Google", icon: Mail, connected: true },
                  { name: "Twitter", icon: Twitter, connected: false },
                  { name: "Instagram", icon: Instagram, connected: true },
                  { name: "Facebook", icon: Facebook, connected: false },
                  { name: "Github", icon: Github, connected: false },
                ].map((account) => (
                  <div key={account.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <account.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{account.name}</h4>
                        <p className="text-sm text-muted-foreground">{account.connected ? "Connected" : "Not connected"}</p>
                      </div>
                    </div>
                    <Button variant={account.connected ? "outline" : "default"} size="sm">
                      {account.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>

              <Alert className="mt-6">
                <AlertDescription>
                  Connecting accounts helps us provide better recommendations and lets you share your travel experiences across platforms.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
