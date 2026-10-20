import {createContext} from "react";

export interface ThemeContextType {
  theme: "light" | "dark";
  setIsDarkMode: (isDarkMode: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);