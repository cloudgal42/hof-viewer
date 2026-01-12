import './css/App.scss'
import {type City} from "./components/CityCard.tsx";
import {Container, Navbar} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Sidebar} from "./components/Sidebar.tsx";
import {HamburgerButton} from "./components/HamburgerButton.tsx";
import {Outlet} from "react-router";
// import {Screenshots} from "./temp/screenshots.ts";

export type SortOrder = "Ascending" | "Descending";

export type ContextType = {
  cities: City[];
  isLoading: boolean;
  creator?: string;
  setCurrCreator: (creator: string) => void;
}

const App = () => {
  const [creator, setCurrCreator] = useState<string>("");
  const [cities, setCities] = useState<City[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAsideOpened, setIsAsideOpened] = useState<boolean>(false);

  const contextParams = {
    cities,
    creator, setCurrCreator,
    isLoading,
  }

  useEffect(() => {
    let ignore = false;
    if (!creator) return;

    async function getCreatorCities() {
      setIsLoading(true);
      const res = await fetch(`https://halloffame.cs2.mtq.io/api/v1/screenshots?creatorId=${creator}`);
      const data = await res.json();

      if (res.ok && !ignore) {
        setCities(data);
        setIsLoading(false);
      } else {
        setCities([]);
        setIsLoading(false);
      }

      // const screenshots = JSON.parse(Screenshots);
      // setCities(screenshots);
      // setIsLoading(false);

    }

    getCreatorCities();

    return () => {
      ignore = true
    };
  }, [creator]);



  // TODO: Migrate all regular bootstrap classes with react-bootstrap
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container fluid className="justify-content-start align-items-center ps-2 ps-sm-3 ms-sm-3 ms-lg-0">
          <HamburgerButton isOpened={isAsideOpened} setIsOpened={setIsAsideOpened} />
          <Navbar.Brand href="#home">
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
