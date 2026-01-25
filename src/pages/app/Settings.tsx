import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Building2,
  Mail,
  Phone,
  Save,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

export function SettingsPage() {
  const { toast } = useToast();
  const { currentUser, currentCentre, currentRole } = useApp();
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: "+65 9123 4567",
  });
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    sessionAlerts: true,
    invoiceNotifications: true,
    marketingEmails: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            {currentRole === 'admin' && (
              <>
                <TabsTrigger value="centre" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Centre</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-card rounded-xl border shadow-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">Update your personal details</p>
              </div>
              <Separator />
              
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{currentRole}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-card rounded-xl border shadow-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
              </div>
              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive session reminders via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailReminders: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when sessions start</p>
                  </div>
                  <Switch
                    checked={notifications.sessionAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sessionAlerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invoice Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive payment reminders and receipts</p>
                  </div>
                  <Switch
                    checked={notifications.invoiceNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, invoiceNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive news and promotional content</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Centre Tab (Admin only) */}
          <TabsContent value="centre">
            <div className="bg-card rounded-xl border shadow-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Centre Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your tuition centre details</p>
              </div>
              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Centre Name</Label>
                  <Input defaultValue={currentCentre.name} />
                </div>
                <div className="space-y-2">
                  <Label>Subdomain</Label>
                  <div className="flex">
                    <Input defaultValue={currentCentre.subdomain} className="rounded-r-none" />
                    <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted text-sm text-muted-foreground">
                      .campus.edu
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg border"
                      style={{ backgroundColor: currentCentre.primaryColor }}
                    />
                    <Input defaultValue={currentCentre.primaryColor} className="max-w-[150px]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Centre Settings
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab (Admin only) */}
          <TabsContent value="security">
            <div className="bg-card rounded-xl border shadow-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Security Settings</h2>
                <p className="text-sm text-muted-foreground">Manage passwords and access</p>
              </div>
              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Shield className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}