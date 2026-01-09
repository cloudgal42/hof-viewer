import './css/App.scss'
import {CityCard} from "./components/CityCard.tsx";
import Form from "react-bootstrap/Form"
import {Button} from "react-bootstrap";

const App = () => {
  // FIXME
  const cityJson = "{\n" +
    "    \"id\": \"6829f79fc02740a7570c407b\",\n" +
    "    \"isApproved\": false,\n" +
    "    \"isReported\": false,\n" +
    "    \"favoritesCount\": 2,\n" +
    "    \"favoritingPercentage\": 4,\n" +
    "    \"viewsCount\": 59,\n" +
    "    \"uniqueViewsCount\": 55,\n" +
    "    \"cityName\": \"三谷市\",\n" +
    "    \"cityNameLocale\": \"zh\",\n" +
    "    \"cityNameLatinized\": \"Sān Gǔ Shì\",\n" +
    "    \"cityNameTranslated\": \"Sangu City\",\n" +
    "    \"cityMilestone\": 20,\n" +
    "    \"cityPopulation\": 161924,\n" +
    "    \"mapName\": null,\n" +
    "    \"description\": null,\n" +
    "    \"imageUrlThumbnail\": \"https://camo.githubusercontent.com/5e45bc648dba68520ce949a53690af6bcef2880f84a1d46cbb1636649afd6d84/68747470733a2f2f796176757a63656c696b65722e6769746875622e696f2f73616d706c652d696d616765732f696d6167652d313032312e6a7067\",\n" +
    "    \"imageUrlFHD\": \"https://halloffame.azureedge.net/screenshots/6820bb1a993cddec3119c67f/6829f79fc02740a7570c407b/foxprogrammer-2025-05-18-15-07-11-fhd.jpg\",\n" +
    "    \"imageUrl4K\": \"https://halloffame.azureedge.net/screenshots/6820bb1a993cddec3119c67f/6829f79fc02740a7570c407b/foxprogrammer-2025-05-18-15-07-11-4k.jpg\",\n" +
    "    \"shareParadoxModIds\": true,\n" +
    "    \"paradoxModIds\": [74417, 75426, 75724, 74604, 77240, 76050, 75250, 79020, 79634, 100454, 94094, 75993, 81157, 106957, 94394, 104781, 102255, 80939, 83168, 75749, 104816, 74285, 80095, 96779, 98960, 101159, 92245, 92859, 91931, 99563, 92387, 74328, 79329, 92863, 75910, 85284, 84515, 91433, 87428, 91930, 84638, 75826, 80528, 75728, 75804, 90794, 75816, 79021, 84644, 77171, 78960, 79237, 86605, 85211, 87190, 74324, 77175, 78188, 75613, 85825, 79794, 86462, 88266, 95437, 96718, 75190, 74286, 78903, 101948, 101898],\n" +
    "    \"shareRenderSettings\": true,\n" +
    "    \"renderSettings\": {\n" +
    "      \"Time of Day\": 14.31241\n" +
    "    },\n" +
    "    \"createdAt\": \"2025-05-18T15:07:09.614Z\",\n" +
    "    \"createdAtFormatted\": \"05/18/2025, 3:07 PM\",\n" +
    "    \"createdAtFormattedDistance\": \"8 months ago\",\n" +
    "    \"creatorId\": \"6820bb1a993cddec3119c67f\",\n" +
    "    \"creator\": {\n" +
    "      \"id\": \"6820bb1a993cddec3119c67f\",\n" +
    "      \"creatorName\": \"foxxy\",\n" +
    "      \"creatorNameSlug\": \"foxxy\",\n" +
    "      \"creatorNameLocale\": null,\n" +
    "      \"creatorNameLatinized\": null,\n" +
    "      \"creatorNameTranslated\": null,\n" +
    "      \"createdAt\": \"2025-05-11T14:58:34.946Z\",\n" +
    "      \"socials\": []\n" +
    "    },\n" +
    "    \"showcasedModId\": null,\n" +
    "    \"__favorited\": false\n" +
    "  }"
    const city = JSON.parse(cityJson);

  return (
    <>
      <div className="container-lg mt-3">
        <h1>Hall of Fame Feed</h1>
        <section className="mt-3 mb-3">
          <Form.Label htmlFor="creatorId">Enter the Creator ID:</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              id="creatorId"
              placeholder="Creator ID..."
            />
            <Button>Search</Button>
          </div>
        </section>
        <section>
          <div>
            <h2>Cities</h2>
          </div>
          <div id="city-feed" className="d-flex gap-2">
            <CityCard city={city} />
            <CityCard city={city} />
            <CityCard city={city} />
          </div>
        </section>
      </div>
      {/*<div>*/}
      {/*  <a href="https://vite.dev" target="_blank">*/}
      {/*    <img src={viteLogo} className="logo" alt="Vite logo" />*/}
      {/*  </a>*/}
      {/*  <a href="https://react.dev" target="_blank">*/}
      {/*    <img src={reactLogo} className="logo react" alt="React logo" />*/}
      {/*  </a>*/}
      {/*</div>*/}
      {/*<h1>Vite + React</h1>*/}
      {/*<div className="card">*/}
      {/*  <button onClick={() => setCount((count) => count + 1)}>*/}
      {/*    count is {count}*/}
      {/*  </button>*/}
      {/*  <p>*/}
      {/*    Edit <code>src/App.tsx</code> and save to test HMR*/}
      {/*  </p>*/}
      {/*</div>*/}
      {/*<p className="read-the-docs">*/}
      {/*  Click on the Vite and React logos to learn more*/}
      {/*</p>*/}
    </>
  )
}

export default App
