import {type Dispatch, type SetStateAction, useState} from "react";
import {Button, Form, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import {useLocalStorage} from "usehooks-ts";
import type {RandomAlgoSettings} from "../../../interfaces/RandomAlgoSettings.ts";
import {Info, InfoCircle} from "react-bootstrap-icons";

export const AlgoSettingsModal = (
  {
    show,
    setShow,
    randomAlgoSettings,
    setRandomAlgoSettings,
  }: {
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
    randomAlgoSettings: RandomAlgoSettings,
    setRandomAlgoSettings: Dispatch<SetStateAction<RandomAlgoSettings>>,
  }
) => {

  const [randomVal, setRandomVal] = useState<number>(randomAlgoSettings.random);
  const [popularVal, setPopularVal] = useState<number>(randomAlgoSettings.popular);
  const [trendingVal, setTrendingVal] = useState<number>(randomAlgoSettings.trending);
  const [recentVal, setRecentVal] = useState<number>(randomAlgoSettings.recent);
  // const [archeologistVal, setArcheologistVal] = useState<number>(randomAlgoSettings.archeologist);
  const [supporterVal, setSupporterVal] = useState<number>(randomAlgoSettings.supporter);
  const [viewMaxAgeVal, setViewMaxAgeVal] = useState<number>(randomAlgoSettings.viewMaxAge);

  function hideModal() {
    // Reset settings to currently saved value
    setRandomVal(randomAlgoSettings.random);
    setPopularVal(randomAlgoSettings.popular);
    setTrendingVal(randomAlgoSettings.trending);
    setRecentVal(randomAlgoSettings.recent);
    setSupporterVal(randomAlgoSettings.supporter);
    setViewMaxAgeVal(randomAlgoSettings.viewMaxAge);

    setShow(false);
  }

  function handleSaveSettings() {
    setShow(false);
    setRandomAlgoSettings({
      random: randomVal,
      popular: popularVal,
      trending: trendingVal,
      recent: recentVal,
      archeologist: 0,
      supporter: supporterVal,
      viewMaxAge: viewMaxAgeVal,
    });
  }


  return (
    <Modal
      show={show}
      onHide={hideModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3 className="fs-4 mb-1">Algorithm Settings</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted fw-normal">
          Change how should Hall of Fame weigh the next random screenshot. Each factor contributes to which screenshot
          should be picked next.
        </p>
        <Form>
          <div className="mb-2">
            <Form.Label htmlFor="randomVal" className="d-flex align-items-center gap-2">
              Random
              <OverlayTrigger overlay={<Tooltip>Screenshots chosen completely by random.</Tooltip>}>
                <InfoCircle/>
              </OverlayTrigger>
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="randomVal"
                aria-label="randomValCounter"
                min="0"
                max="10"
                value={randomVal}
                onChange={e => setRandomVal(parseInt(e.currentTarget.value))}
              />
              <span id="randomValCounter">{randomVal}</span>
            </div>
          </div>
          <div className="mb-2">
            <Form.Label htmlFor="popularVal" className="d-flex align-items-center gap-2">
              Popular
              <OverlayTrigger overlay={<Tooltip>Screenshots that have an above average likes/views ratio.</Tooltip>}>
                <InfoCircle/>
              </OverlayTrigger>
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="popularVal"
                aria-describedby="popularValCounter"
                min="0"
                max="10"
                value={popularVal}
                onChange={e => setPopularVal(parseInt(e.currentTarget.value))}
              />
              <span id="popularValCounter">{popularVal}</span>
            </div>
          </div>
          <div className="mb-2">
            <Form.Label htmlFor="trendingVal" className="d-flex align-items-center gap-2">
              Trending
              <OverlayTrigger
                overlay={<Tooltip>Popular screenshots that have the highest likes/views ratio, regardless of
                  age.</Tooltip>}>
                <InfoCircle/>
              </OverlayTrigger>
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="trendingVal"
                aria-describedby="trendingValCounter"
                min="0"
                max="10"
                value={trendingVal}
                onChange={e => setTrendingVal(parseInt(e.currentTarget.value))}
              />
              <span id="trendingValCounter">{trendingVal}</span>
            </div>
          </div>
          <div className="mb-2">
            <Form.Label htmlFor="recentVal" className="d-flex align-items-center gap-2">
              Recent
              <OverlayTrigger overlay={<Tooltip>Recently posted screenshots (up to a few days old)</Tooltip>}>
                <InfoCircle/>
              </OverlayTrigger>
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="recentVal"
                aria-describedby="recentValCounter"
                min="0"
                max="10"
                value={recentVal}
                onChange={e => setRecentVal(parseInt(e.currentTarget.value))}
              />
              <span id="recentValCounter">{recentVal}</span>
            </div>
          </div>
          {/*<div className="mb-2">*/}
          {/*  <Form.Label htmlFor="archeologistVal">Archelogist</Form.Label>*/}
          {/*  <div className="d-flex align-items-center gap-4">*/}
          {/*    <Form.Range*/}
          {/*      id="archeologistVal"*/}
          {/*      aria-describedby="archeologistValCounter"*/}
          {/*      min="0"*/}
          {/*      max="10"*/}
          {/*      value={archeologistVal}*/}
          {/*      onChange={e => setArcheologistVal(parseInt(e.currentTarget.value))}*/}
          {/*    />*/}
          {/*    <span id="archeologistValCounter">{archeologistVal}</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="mb-2">
            <Form.Label htmlFor="supporterVal" className="d-flex align-items-center gap-2">
              Supporter
              <OverlayTrigger overlay={<Tooltip>Screenshots from Hall of Fame's community members.</Tooltip>}>
                <InfoCircle/>
              </OverlayTrigger>
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="supporterVal"
                aria-describedby="supporterValCounter"
                min="0"
                max="10"
                value={supporterVal}
                onChange={e => setSupporterVal(parseInt(e.currentTarget.value))}
              />
              <span id="supporterValCounter">{supporterVal}</span>
            </div>
          </div>
          <div className="mb-2">
            <Form.Label htmlFor="viewMaxAgeVal">Minimum # of days until a screenshot is shown again</Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="viewMaxAgeVal"
                aria-describedby="viewMaxAgeValCounter"
                min="0"
                max="365"
                value={viewMaxAgeVal}
                onChange={e => setViewMaxAgeVal(parseInt(e.currentTarget.value))}
              />
              <span id="supporterValCounter">{viewMaxAgeVal}</span>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={hideModal}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}