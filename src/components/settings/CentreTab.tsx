import { useState } from "react";
import { 
  Save, 
  Upload, 
  Building2,
  Palette,
  Globe,
  CreditCard,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { centreThemes, CentreTheme } from "@/lib/demo-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function CentreTab() {
  const { toast } = useToast();
  const { currentCentre, setCurrentCentre } = useApp();
  
  const [centreForm, setCentreForm] = useState({
    name: currentCentre.name,
    subdomain: currentCentre.subdomain,
    timezone: currentCentre.timezone || 'Asia/Singapore',
    currency: currentCentre.currency || 'SGD',
    invoicePrefix: currentCentre.invoicePrefix || 'INV',
    themeId: currentCentre.themeId || 'theme-navy',
  });

  const selectedTheme = centreThemes.find(t => t.id === centreForm.themeId) || centreThemes[0];

  const handleSave = () => {
    setCurrentCentre({
      ...currentCentre,
      name: centreForm.name,
      subdomain: centreForm.subdomain,
      timezone: centreForm.timezone as 'Asia/Singapore' | 'Asia/Kuala_Lumpur',
      currency: centreForm.currency as 'SGD' | 'MYR',
      invoicePrefix: centreForm.invoicePrefix,
      primaryColor: selectedTheme.primaryColor,
      secondaryColor: selectedTheme.secondaryColor,
      themeId: centreForm.themeId,
    });
    toast({
      title: "Centre Settings Saved",
      description: "Your centre settings have been updated successfully.",
    });
  };

  const handleLogoUpload = () => {
    toast({
      title: "Upload Logo",
      description: "Logo upload functionality will be available with Lovable Cloud.",
    });
  };

  return (
    <div className="bg-card rounded-xl border shadow-card p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Centre Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your tuition centre branding and preferences</p>
      </div>
      <Separator />

      {/* Logo Upload */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Centre Logo
        </Label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
            {currentCentre.logo ? (
              <img src={currentCentre.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground/50" />
            )}
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={handleLogoUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Logo
            </Button>
            <p className="text-xs text-muted-foreground">
              Recommended: 200x200px, PNG or SVG
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="centre-name">Centre Name (Portal Display)</Label>
          <Input
            id="centre-name"
            value={centreForm.name}
            onChange={(e) => setCentreForm({ ...centreForm, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <div className="flex">
            <Input 
              id="subdomain"
              value={centreForm.subdomain} 
              onChange={(e) => setCentreForm({ ...centreForm, subdomain: e.target.value })}
              className="rounded-r-none" 
            />
            <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted text-sm text-muted-foreground">
              .campus.edu
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Regional Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Regional Settings
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone">Default Timezone</Label>
            <Select 
              value={centreForm.timezone} 
              onValueChange={(value: 'Asia/Singapore' | 'Asia/Kuala_Lumpur') => setCentreForm({ ...centreForm, timezone: value })}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                <SelectItem value="Asia/Kuala_Lumpur">Malaysia (GMT+8)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select 
              value={centreForm.currency} 
              onValueChange={(value: 'SGD' | 'MYR') => setCentreForm({ ...centreForm, currency: value })}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Invoice Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Invoice Settings
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
            <div className="flex items-center gap-2">
              <Input
                id="invoice-prefix"
                value={centreForm.invoicePrefix}
                onChange={(e) => setCentreForm({ ...centreForm, invoicePrefix: e.target.value.toUpperCase() })}
                className="max-w-[100px]"
                maxLength={5}
              />
              <span className="text-sm text-muted-foreground">-0001</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Preview: {centreForm.invoicePrefix}-0001
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Theme Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Selection
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {centreThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setCentreForm({ ...centreForm, themeId: theme.id })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all text-left",
                centreForm.themeId === theme.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div 
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: theme.secondaryColor }}
                />
              </div>
              <p className="text-sm font-medium">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Centre Settings
        </Button>
      </div>
    </div>
  );
}
