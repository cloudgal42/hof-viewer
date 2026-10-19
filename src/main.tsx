import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/App.scss";
import "./css/index.scss";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { GroupedCitiesOverrideSettingsProvider } from "./providers/GroupedCitiesOverrideSettingsProvider.tsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { CrashFallback } from "./components/misc/CrashFallback/CrashFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";

const Home = lazy(() => import("./pages/Home.tsx"));
const CityDetails = lazy(() => import("./pages/CityDetails.tsx"));
const Creators = lazy(() => import("./pages/Creators.tsx"));
const RandomCity = lazy(() => import("./pages/RandomCity.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={({ error }) => {
        const err = error as Error;
        return <CrashFallback err={err} />;
      }}
    >
      <HelmetProvider>
        <GroupedCitiesOverrideSettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="city/:city" element={<CityDetails />} />
                <Route path="creators" element={<Creators />} />
                <Route path="random" element={<RandomCity />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </GroupedCitiesOverrideSettingsProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
