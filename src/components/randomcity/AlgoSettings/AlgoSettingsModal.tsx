import {type Dispatch, type SetStateAction, useState} from "react";
import {Button, Form, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import type {RandomAlgoSettings} from "../../../interfaces/RandomAlgoSettings.ts";
import {ArrowClockwise, InfoCircle} from "react-bootstrap-icons";

const DEFAULT_SETTINGS = {
  random: 5,
  popular: 10,
  trending: 10,
  recent: 10,
  archeologist: 0,
  supporter: 1,
  viewMaxAge: 60,
}

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
  const [archeologistVal, setArcheologistVal] = useState<number>(randomAlgoSettings.archeologist);
  const [supporterVal, setSupporterVal] = useState<number>(randomAlgoSettings.supporter);
  const [viewMaxAgeVal, setViewMaxAgeVal] = useState<number>(randomAlgoSettings.viewMaxAge);

  function hideModal() {
    // Reset settings to currently saved value
    setRandomVal(randomAlgoSettings.random);
    setPopularVal(randomAlgoSettings.popular);
    setTrendingVal(randomAlgoSettings.trending);
    setRecentVal(randomAlgoSettings.recent);
    setArcheologistVal(randomAlgoSettings.archeologist);
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

  function resetSettings() {
    setRandomVal(DEFAULT_SETTINGS.random);
    setPopularVal(DEFAULT_SETTINGS.popular);
    setTrendingVal(DEFAULT_SETTINGS.trending);
    setRecentVal(DEFAULT_SETTINGS.recent);
    setArcheologistVal(DEFAULT_SETTINGS.archeologist);
    setSupporterVal(DEFAULT_SETTINGS.supporter);
    setViewMaxAgeVal(DEFAULT_SETTINGS.viewMaxAge);
  }

  return (
    <Modal
      show={show}
      onHide={hideModal}
      dialogClassName="algo-settings-modal-width"
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
              {randomVal !== randomAlgoSettings.random && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                    onClick={() => setRandomVal(randomAlgoSettings.random)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
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
              {popularVal !== randomAlgoSettings.popular && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                    onClick={() => setPopularVal(randomAlgoSettings.popular)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
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
              {trendingVal !== randomAlgoSettings.trending && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                    onClick={() => setTrendingVal(randomAlgoSettings.trending)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
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
              {recentVal !== randomAlgoSettings.recent && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                    onClick={() => setRecentVal(randomAlgoSettings.recent)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
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
          <div className="mb-2">
            <Form.Label htmlFor="archeologistVal" className="d-flex align-items-center gap-2">
              Forgotten Ones
              <OverlayTrigger overlay={<Tooltip>Screenshots that have not seen any activity for some time.</Tooltip>}>
                <InfoCircle/>
              </OverlayTrigger>
              {archeologistVal !== randomAlgoSettings.archeologist && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                    onClick={() => setArcheologistVal(randomAlgoSettings.archeologist)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="archeologistVal"
                aria-describedby="archeologistValCounter"
                min="0"
                max="10"
                value={archeologistVal}
                onChange={e => setArcheologistVal(parseInt(e.currentTarget.value))}
              />
              <span id="archeologistValCounter">{archeologistVal}</span>
            </div>
          </div>
          <div className="mb-2">
            <Form.Label htmlFor="supporterVal" className="d-flex align-items-center gap-2">
              Supporter
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    Screenshots from Hall of Fame's members that assist the platform's development (e.g.
                    donations, being a positive contributor to the platform).
                  </Tooltip>
                }
              >
                <InfoCircle/>
              </OverlayTrigger>
              {supporterVal !== randomAlgoSettings.supporter && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-flex align-items-center"
                    onClick={() => setSupporterVal(randomAlgoSettings.supporter)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
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
            <Form.Label htmlFor="viewMaxAgeVal" className="d-flex">
              Minimum days until a screenshot can be shown again
              {viewMaxAgeVal !== randomAlgoSettings.viewMaxAge && (
                <OverlayTrigger overlay={<Tooltip>Reset to last saved value</Tooltip>}>
                  <button
                    className="ms-2 p-0 border-0 bg-transparent d-inline-flex align-items-center"
                    onClick={() => setViewMaxAgeVal(randomAlgoSettings.viewMaxAge)}
                  >
                    <span className="visually-hidden">Reset to last saved value</span>
                    <ArrowClockwise/>
                  </button>
                </OverlayTrigger>
              )}
            </Form.Label>
            <div className="d-flex align-items-center gap-4">
              <Form.Range
                id="viewMaxAgeVal"
                aria-describedby="viewMaxAgeValCounter"
                min="0"
                max="365"
                value={viewMaxAgeVal}
                onChange={e => setViewMaxAgeVal(parseInt(e.currentTarget.value))}
              />
              <span id="viewMaxAgeValCounter">{viewMaxAgeVal}</span>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="me-auto ps-0" onClick={resetSettings}>
          Defaults
        </Button>
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