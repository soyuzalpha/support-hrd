export type ThemeColors = {
  name: string;
  label: string;
  colors: Record<string, string>;
};

export const themes: ThemeColors[] = [
  {
    name: "default-light",
    label: "Default Light",
    colors: {
      // Default light theme colors
    }
  },
  {
    name: "default-dark",
    label: "Default Dark",
    colors: {
      // Default dark theme colors
    }
  },
  {
    name: "nord-light",
    label: "Nord Light",
    colors: {
      "--background": "240 248 255", // Polar Night lightest
      "--foreground": "46 52 64", // Polar Night darkest
      "--card": "236 239 244", // Snow Storm lightest
      "--card-foreground": "46 52 64", // Polar Night darkest
      "--popover": "255 255 255",
      "--popover-foreground": "46 52 64", // Polar Night darkest
      "--primary": "94 129 172", // Frost
      "--primary-foreground": "236 239 244", // Snow Storm lightest
      "--secondary": "129 161 193", // Frost lighter
      "--secondary-foreground": "46 52 64", // Polar Night darkest
      "--muted": "216 222 233", // Snow Storm medium
      "--muted-foreground": "76 86 106", // Polar Night lighter
      "--accent": "136 192 208", // Frost accent
      "--accent-foreground": "46 52 64", // Polar Night darkest
      "--destructive": "191 97 106", // Aurora red
      "--destructive-foreground": "236 239 244", // Snow Storm lightest
      "--border": "216 222 233", // Snow Storm medium
      "--input": "216 222 233", // Snow Storm medium
      "--ring": "94 129 172", // Frost
    }
  },
  {
    name: "nord-dark",
    label: "Nord Dark",
    colors: {
      "--background": "46 52 64", // Polar Night darkest
      "--foreground": "236 239 244", // Snow Storm lightest
      "--card": "59 66 82", // Polar Night lighter
      "--card-foreground": "236 239 244", // Snow Storm lightest
      "--popover": "59 66 82", // Polar Night lighter
      "--popover-foreground": "236 239 244", // Snow Storm lightest
      "--primary": "136 192 208", // Frost accent
      "--primary-foreground": "46 52 64", // Polar Night darkest
      "--secondary": "129 161 193", // Frost lighter
      "--secondary-foreground": "236 239 244", // Snow Storm lightest
      "--muted": "67 76 94", // Polar Night medium
      "--muted-foreground": "216 222 233", // Snow Storm medium
      "--accent": "94 129 172", // Frost
      "--accent-foreground": "236 239 244", // Snow Storm lightest
      "--destructive": "191 97 106", // Aurora red
      "--destructive-foreground": "236 239 244", // Snow Storm lightest
      "--border": "67 76 94", // Polar Night medium
      "--input": "67 76 94", // Polar Night medium
      "--ring": "136 192 208", // Frost accent
    }
  },
  {
    name: "catppuccin-latte",
    label: "Catppuccin Latte",
    colors: {
      "--background": "239 241 245", // Base
      "--foreground": "76 79 105", // Text
      "--card": "230 233 239", // Crust
      "--card-foreground": "76 79 105", // Text
      "--popover": "239 241 245", // Base
      "--popover-foreground": "76 79 105", // Text
      "--primary": "136 57 239", // Mauve
      "--primary-foreground": "239 241 245", // Base
      "--secondary": "140 170 238", // Blue
      "--secondary-foreground": "76 79 105", // Text
      "--muted": "220 224 232", // Surface 0
      "--muted-foreground": "92 95 119", // Subtext 0
      "--accent": "242 213 207", // Rosewater
      "--accent-foreground": "76 79 105", // Text
      "--destructive": "210 15 57", // Red
      "--destructive-foreground": "239 241 245", // Base
      "--border": "204 208 218", // Surface 1
      "--input": "204 208 218", // Surface 1
      "--ring": "136 57 239", // Mauve
    }
  },
  {
    name: "catppuccin-mocha",
    label: "Catppuccin Mocha",
    colors: {
      "--background": "30 30 46", // Base
      "--foreground": "205 214 244", // Text
      "--card": "24 24 37", // Crust
      "--card-foreground": "205 214 244", // Text
      "--popover": "30 30 46", // Base
      "--popover-foreground": "205 214 244", // Text
      "--primary": "203 166 247", // Mauve
      "--primary-foreground": "30 30 46", // Base
      "--secondary": "137 180 250", // Blue
      "--secondary-foreground": "205 214 244", // Text
      "--muted": "49 50 68", // Surface 0
      "--muted-foreground": "186 194 222", // Subtext 0
      "--accent": "245 224 220", // Rosewater
      "--accent-foreground": "30 30 46", // Base
      "--destructive": "243 139 168", // Red
      "--destructive-foreground": "205 214 244", // Text
      "--border": "49 50 68", // Surface 1
      "--input": "49 50 68", // Surface 1
      "--ring": "203 166 247", // Mauve
    }
  }
];

export function getTheme(themeName: string): ThemeColors | undefined {
  return themes.find(theme => theme.name === themeName);
}