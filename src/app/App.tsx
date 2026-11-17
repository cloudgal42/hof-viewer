import { Navbar, Spinner } from "react-bootstrap";
import { Suspense, useState } from "react";
import { Sidebar } from "../components/navigation/Sidebar/Sidebar.tsx";
import { HamburgerButton } from "../components/buttons/Hamburger/HamburgerButton.tsx";
import { Outlet, useLocation } from "react-router";
import { ToTopBtn } from "../components/buttons/ToTopButton/ToTopBtn.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRandomCityGc } from "../hooks/useRandomCityGc.ts";
import {ThemeDropdownBtn} from "../components/buttons/ThemeDropdownBtn/ThemeDropdownBtn.tsx";
import { AppNavbar } from "../components/navigation/Navbar/Navbar.tsx";
// import {Screenshots} from "./temp/screenshots.ts";

export type ContextType = {
  startGc: () => void;
  gcCount: number;
  randomCityPage: number;
  setRandomCityPage: (page: number) => void;
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
  const [isAsideOpened, setIsAsideOpened] = useState<boolean>(false);
  const [gcCount, setGcCount] = useState<number>(0);
  
  const [randomCityPage, setRandomCityPage] = useState<number>(0);

  const location = useLocation();
  // FIXME: Remove this once we switched to using useInfiniteQuery from TSQ, since this is just Bad.
  const { startGc } = useRandomCityGc(queryClient, () => {
    setGcCount((c) => c + 1);
  });

  const contextParams = {
    startGc,
    gcCount,
    randomCityPage,
    setRandomCityPage,
  };

  return (
    <>
      <a id="mainContentLink" href="#mainContent">
        Skip to main content
      </a>
        <h1 className="visually-hidden">Hall of Fame Viewer</h1>
				<AppNavbar isAsideOpened={isAsideOpened} setIsAsideOpened={setIsAsideOpened} />
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
                    <Spinner animation="grow" role="status">
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
    </>
  );
};

export default App;
