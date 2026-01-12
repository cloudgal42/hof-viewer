import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/App.scss'
import './css/index.scss'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import {Home} from "./pages/Home.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
