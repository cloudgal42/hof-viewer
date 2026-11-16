import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../css/App.scss";
import "../css/index.scss";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { GroupedCitiesOverrideSettingsProvider } from "./providers/GroupedCitiesOverrideSettingsProvider.tsx";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { CrashFallback } from "../components/errorscreen/CrashFallback/CrashFallback.tsx";
import { ErrorBoundary } from "react-error-boundary";
import {ThemeContextProvider} from "./providers/ThemeContextProvider.tsx";

const Home = lazy(() => import("./pages/Home/Home.tsx"));
const CityDetails = lazy(() => import("./pages/CityDetails/CityDetails.tsx"));
const Creators = lazy(() => import("./pages/Creators/Creators.tsx"));
const RandomCity = lazy(() => import("./pages/RandomCity/RandomCity.tsx"));
const Settings = lazy(() => import("./pages/Settings/Settings.tsx"));
const About = lazy(() => import("./pages/About/About.tsx"));

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
          <ThemeContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="city/:city" element={<CityDetails />} />
                  <Route path="creators" element={<Creators />} />
                  <Route path="random" element={<RandomCity />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="about" element={<About />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ThemeContextProvider>
        </GroupedCitiesOverrideSettingsProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
