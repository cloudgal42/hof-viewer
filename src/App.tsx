import './css/App.scss'
import {type City, type GroupedCities} from "./components/CityCard.tsx";
import {Container, Navbar} from "react-bootstrap";
import {useState} from "react";
import {Sidebar} from "./components/Sidebar.tsx";
import {HamburgerButton} from "./components/HamburgerButton.tsx";
import {Outlet} from "react-router";
// import {Screenshots} from "./temp/screenshots.ts";

export type SortOrder = "Ascending" | "Descending";

export type ContextType = {
  cities: City[];
  city?: City | GroupedCities;
  isLoading: boolean;
  creator?: string;
  setCity: (newCity: City | GroupedCities) => void;
  setCities: (cities: City[]) => void;
  setCurrCreator: (creator: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const App = () => {
  const [creator, setCurrCreator] = useState<string>("");
  const [cities, setCities] = useState<City[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAsideOpened, setIsAsideOpened] = useState<boolean>(false);
  const [city, setCity] = useState<City | GroupedCities | undefined>()

  const contextParams = {
    cities, setCities,
    city, setCity,
    creator, setCurrCreator,
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
      <div className="d-flex flex-nowrap">
        <aside className="d-none d-lg-block flex-shrink-0">
          <Sidebar isOpened={isAsideOpened} setIsOpened={setIsAsideOpened} />
        </aside>
        <main className="mt-3 flex-grow-1 d-flex justify-content-center">
          <Outlet context={contextParams satisfies ContextType} />
        </main>
      </div>
    </>
  )
}

export default App
