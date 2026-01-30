// Theme utilities for dynamic theme application
import { CentreTheme } from '@/lib/demo-data';

// Convert hex color to HSL values string (e.g., "168 45% 40%")
export function hexToHSL(hex: string): string {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Derive a lighter version of a color for backgrounds
export function lightenHSL(hsl: string, amount: number = 50): string {
  const parts = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!parts) return hsl;
  
  const h = parseInt(parts[1]);
  const s = Math.max(0, parseInt(parts[2]) - 30); // Reduce saturation
  const l = Math.min(98, parseInt(parts[3]) + amount); // Increase lightness
  
  return `${h} ${s}% ${l}%`;
}

// Apply theme to document CSS variables
export function applyTheme(theme: CentreTheme): void {
  const root = document.documentElement;
  
  const primaryHSL = hexToHSL(theme.primaryColor);
  const secondaryHSL = hexToHSL(theme.secondaryColor);
  
  // Apply accent color (the vibrant brand color)
  root.style.setProperty('--accent', secondaryHSL);
  
  // Apply progress color to match accent
  root.style.setProperty('--progress', secondaryHSL);
  root.style.setProperty('--progress-bg', lightenHSL(secondaryHSL, 55));
  
  // Apply role-student color to match theme
  root.style.setProperty('--role-student', secondaryHSL);
  
  // For sidebar accent (subtle background for active items)
  root.style.setProperty('--sidebar-accent', lightenHSL(primaryHSL, 85));
  
  // Store the theme in localStorage for persistence
  localStorage.setItem('centre-theme', JSON.stringify(theme));
}

// Load and apply saved theme on app init
export function loadSavedTheme(): CentreTheme | null {
  try {
    const saved = localStorage.getItem('centre-theme');
    if (saved) {
      const theme = JSON.parse(saved) as CentreTheme;
      applyTheme(theme);
      return theme;
    }
  } catch (e) {
    console.warn('Failed to load saved theme:', e);
  }
  return null;
}

// Reset to default theme
export function resetTheme(): void {
  const root = document.documentElement;
  
  // Reset to defaults from index.css
  root.style.removeProperty('--accent');
  root.style.removeProperty('--progress');
  root.style.removeProperty('--progress-bg');
  root.style.removeProperty('--role-student');
  root.style.removeProperty('--sidebar-accent');
  
  localStorage.removeItem('centre-theme');
}
