import {useLocalStorage} from "usehooks-ts";
import {ThemeContext} from "../../context/ThemeContext.ts";
import {type ReactNode, useEffect} from "react";

export const ThemeContextProvider = (
  {children} : {children: ReactNode}
) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    "isDarkMode",
    false,
  );
  
  // We manipulate the DOM here bc Bootstrap CSS scopes
  // the theme to the <html> document element
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [isDarkMode]);
  
  return (
    <ThemeContext value={{
      theme: isDarkMode ? "dark" : "light",
      setIsDarkMode,
    }}>
      {children}
    </ThemeContext>
  )
}