import {lazy, StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './css/App.scss'
import './css/index.scss'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";

const Home = lazy(() => import("./pages/Home.tsx"));
const CityDetails = lazy(() => import("./pages/CityDetails.tsx"));
const Creators = lazy(() => import("./pages/Creators.tsx"));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="city/:city" element={<CityDetails />} />
          <Route path="creators" element={<Creators />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
