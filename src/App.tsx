import './css/App.scss'
import {Container, Navbar, Spinner} from "react-bootstrap";
import {createContext, Suspense, useEffect, useState} from "react";
import {Sidebar} from "./components/misc/Sidebar/Sidebar.tsx";
import {HamburgerButton} from "./components/misc/Hamburger/HamburgerButton.tsx";
import {NavLink, Outlet, useLocation} from "react-router";
import {useLocalStorage} from "usehooks-ts";
import {ToTopBtn} from "./components/misc/ToTopButton/ToTopBtn.tsx";
import type {City, GroupedCities} from "./interfaces/City.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ErrorBoundary, type FallbackProps} from "react-error-boundary";
import {ErrorScreen} from "./components/misc/ErrorScreen/ErrorScreen.tsx";
import {ThemeContext} from "./context/ThemeContext.ts";
import {CrashFallback} from "./components/misc/CrashFallback/CrashFallback.tsx";
// import {Screenshots} from "./temp/screenshots.ts";

export type ContextType = {
  city?: City | GroupedCities;
  setCity: (newCity: City | GroupedCities) => void;
}

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import("@tanstack/query-core").QueryClient;
  }
}

if (import.meta.env.DEV) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

const App = () => {
  const [city, setCity] = useState<City | GroupedCities | undefined>();

  const [isAsideOpened, setIsAsideOpened] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('isDarkMode', false);

  const location = useLocation();

  // We manipulate the DOM here bc Bootstrap CSS scopes
  // the theme to the <html> document element
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [isDarkMode]);

  const contextParams = {
    city, setCity,
  }

  return (
    <ErrorBoundary
      fallbackRender={({error}) => {
        const err = error as Error;
        return (
          <CrashFallback err={err}/>
        )
      }
      }
    >
      <a id="mainContentLink" href="#mainContent">
        Skip to main content
      </a>
      <ThemeContext value={isDarkMode ? "dark" : "light"}>
        <h1 className="visually-hidden">Hall of Fame Viewer</h1>
        <Navbar
          className="bg-body-tertiary d-lg-none"
          style={{position: "sticky", top: "0px", zIndex: "4"}}
        >
          <Container fluid className="justify-content-start align-items-center ps-2 ps-sm-3 ms-sm-3 ms-lg-0">
            <HamburgerButton isOpened={isAsideOpened} setIsOpened={setIsAsideOpened}/>
            <Navbar.Brand className="py-1" href="/">
              <span className="mb-0 fs-3 fw-semibold">HoF</span>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <ToTopBtn/>
        <div className="d-flex flex-grow-1 flex-column flex-nowrap">
          <div className="d-flex flex-row flex-grow-1">
            <Sidebar
              isOpened={isAsideOpened}
              setIsOpened={setIsAsideOpened}
              setIsDarkMode={setIsDarkMode}
            />
            <main id="mainContent" className="mt-3 mt-lg-5 mb-3 d-flex flex-grow-1 justify-content-center">
              <Suspense key={location.key} fallback={
                <div className="d-flex align-items-center justify-content-center h-100">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              }>
                <QueryClientProvider client={queryClient}>

                  <Outlet context={contextParams satisfies ContextType}/>
                </QueryClientProvider>
              </Suspense>
            </main>
          </div>
          <footer className="text-center p-3 bg-body-tertiary">
            <span className="d-inline-block">&copy; {new Date().getFullYear()} foxxy (cloudgal42)</span>
            <ul className="ms-2 mb-0 list-unstyled d-inline-flex flex-row gap-2">
              <li>
                <a
                  href="https://github.com/cloudgal42/hof-viewer"
                  target="_blank"
                >
                  Source
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cloudgal42/hof-viewer/blob/master/LICENSE"
                  target="_blank"
                >
                  LICENSE
                </a>
              </li>
              <li>
                <a
                  href="https://mods.paradoxplaza.com/mods/90641/Windows"
                  target="_blank"
                >
                  Hall of Fame
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </ThemeContext>
    </ErrorBoundary>
  )
}

export default App
