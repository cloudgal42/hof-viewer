import {useContext} from "react";
import {ThemeContext} from "../context/ThemeContext.ts";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("Theme context must be used within a ThemeContextProvider.");
  }
  
  return {
    ...context,
    isDarkMode: context.theme === "dark",
  };
}