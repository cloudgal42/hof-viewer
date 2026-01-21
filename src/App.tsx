import './css/App.scss'
import {type City, type GroupedCities} from "./components/CityCard.tsx";
import {Container, Navbar} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Sidebar} from "./components/Sidebar.tsx";
import {HamburgerButton} from "./components/HamburgerButton.tsx";
import {Outlet} from "react-router";
import {useLocalStorage} from "usehooks-ts";
// import {Screenshots} from "./temp/screenshots.ts";

export type ContextType = {
  cities: City[];
  city?: City | GroupedCities;
  isLoading: boolean;
  setCity: (newCity: City | GroupedCities) => void;
  setCities: (cities: City[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const App = () => {
  const [cities, setCities] = useState<City[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [city, setCity] = useState<City | GroupedCities | undefined>();

  const [isAsideOpened, setIsAsideOpened] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('isDarkMode', false);

  // We manipulate the DOM here bc Bootstrap CSS scopes
  // the theme to the <html> document element
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [isDarkMode]);

  const contextParams = {
    cities, setCities,
    city, setCity,
    isLoading, setIsLoading,
  }

  // TODO: Migrate all regular bootstrap classes with react-bootstrap
  return (
    <>
      <Navbar className="bg-body-tertiary" style={{position: "sticky", top: "0px", zIndex: "2"}}>
        <Container fluid className="justify-content-start align-items-center ps-2 ps-sm-3 ms-sm-3 ms-lg-0">
          <HamburgerButton isOpened={isAsideOpened} setIsOpened={setIsAsideOpened} />
          <Navbar.Brand href="/">
            <h1 className="mb-0 fs-2">HoF</h1>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="d-flex flex-grow-1 flex-column flex-nowrap">
        <div className="d-flex flex-row flex-grow-1">
          <aside className="d-none d-lg-block flex-shrink-0">
            <Sidebar
              isOpened={isAsideOpened}
              isDarkMode={isDarkMode}
              setIsOpened={setIsAsideOpened}
              setIsDarkMode={setIsDarkMode}
            />
          </aside>
          <main className="mt-3 mb-3 d-flex flex-grow-1 justify-content-center">
            <Outlet context={contextParams satisfies ContextType} />
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
    </>
  )
}

export default App
