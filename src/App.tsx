import "./css/App.scss";
import { Container, Navbar, Spinner } from "react-bootstrap";
import { Suspense, useEffect, useState } from "react";
import { Sidebar } from "./components/misc/Sidebar/Sidebar.tsx";
import { HamburgerButton } from "./components/misc/Hamburger/HamburgerButton.tsx";
import { Outlet, useLocation } from "react-router";
import { useLocalStorage } from "usehooks-ts";
import { ToTopBtn } from "./components/misc/ToTopButton/ToTopBtn.tsx";
import type { City, GroupedCities } from "./interfaces/City.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeContext } from "./context/ThemeContext.ts";
import { CrashFallback } from "./components/misc/CrashFallback/CrashFallback.tsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { useRandomCityGc } from "./hooks/useRandomCityGc.ts";
import {ThemeDropdownBtn} from "./components/misc/ThemeDropdownBtn/ThemeDropdownBtn.tsx";
// import {Screenshots} from "./temp/screenshots.ts";

export type ContextType = {
  city?: City | GroupedCities;
  setCity: (newCity: City | GroupedCities) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  startGc: () => void;
  gcCount: number;
};

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

if (import.meta.env.DEV) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

const App = () => {
  const [city, setCity] = useState<City | GroupedCities | undefined>();

  const [isAsideOpened, setIsAsideOpened] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    "isDarkMode",
    false,
  );
  const [gcCount, setGcCount] = useState<number>(0);

  const location = useLocation();
  // FIXME: Remove this once we switched to using useInfiniteQuery from TSQ, since this is just Bad.
  const { startGc } = useRandomCityGc(queryClient, () => {
    setGcCount((c) => c + 1);
  });

  // We manipulate the DOM here bc Bootstrap CSS scopes
  // the theme to the <html> document element
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [isDarkMode]);

  const contextParams = {
    city,
    setCity,
    startGc,
    gcCount,
    setIsDarkMode,
  };

  return (
    <>
      <a id="mainContentLink" href="#mainContent">
        Skip to main content
      </a>
      <ThemeContext value={{
        theme: isDarkMode ? "dark" : "light",
        setIsDarkMode,
      }}>
        <h1 className="visually-hidden">Hall of Fame Viewer</h1>
        <Navbar
          className="bg-body border-1 border-bottom d-lg-none"
          style={{ position: "sticky", top: "0px", zIndex: "6" }}
        >
          <div className="m-auto main-wrapper flex-grow-1 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <HamburgerButton
                isOpened={isAsideOpened}
                setIsOpened={setIsAsideOpened}
              />
              <Navbar.Brand
                className="position-relative py-1"
                style={{ left: "calc(-0.75rem + 1px)" }}
                href="/"
              >
                <span className="mb-0 fs-3 fw-semibold">HoF</span>
              </Navbar.Brand>
            </div>
            <ThemeDropdownBtn align="end" />
          </div>
        </Navbar>
        <ToTopBtn />
        <div className="d-flex flex-grow-1 flex-column flex-nowrap">
          <div className="d-flex flex-row flex-grow-1">
            <Sidebar
              isOpened={isAsideOpened}
              setIsOpened={setIsAsideOpened}
            />
            <main
              id="mainContent"
              className="mt-3 mt-lg-5 mb-3 d-flex flex-grow-1 justify-content-center"
            >
              <Suspense
                key={location.pathname}
                fallback={
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                }
              >
                <QueryClientProvider client={queryClient}>
                  <Outlet context={contextParams satisfies ContextType} />
                </QueryClientProvider>
              </Suspense>
            </main>
          </div>
        </div>
      </ThemeContext>
    </>
  );
};

export default App;
