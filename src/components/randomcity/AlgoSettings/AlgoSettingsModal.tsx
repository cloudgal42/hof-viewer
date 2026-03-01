import {type Dispatch, type SetStateAction, useState} from "react";
import {Button, Form, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import type {RandomAlgoSettings, TranslateOptions} from "../../../interfaces/RandomAlgoSettings.ts";
import {ArrowClockwise, InfoCircle} from "react-bootstrap-icons";
import {RangeSetting} from "./RangeSetting.tsx";
import {DropdownSetting} from "./DropdownSetting.tsx";

const DEFAULT_SETTINGS: RandomAlgoSettings = {
  translateCityType: "transliterate",
  translateCreatorType: "transliterate",
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

  const [translateCityType, setTranslateCityType] = useState<TranslateOptions>(randomAlgoSettings.translateCityType);
  const [translateCreatorType, setTranslateCreatorType] = useState<TranslateOptions>(randomAlgoSettings.translateCreatorType);

  const [randomVal, setRandomVal] = useState<number>(randomAlgoSettings.random);
  const [popularVal, setPopularVal] = useState<number>(randomAlgoSettings.popular);
  const [trendingVal, setTrendingVal] = useState<number>(randomAlgoSettings.trending);
  const [recentVal, setRecentVal] = useState<number>(randomAlgoSettings.recent);
  const [archeologistVal, setArcheologistVal] = useState<number>(randomAlgoSettings.archeologist);
  const [supporterVal, setSupporterVal] = useState<number>(randomAlgoSettings.supporter);
  const [viewMaxAgeVal, setViewMaxAgeVal] = useState<number>(randomAlgoSettings.viewMaxAge);

  const isSettingsChanged = (translateCityType !== randomAlgoSettings.translateCityType)
    || (translateCreatorType !== randomAlgoSettings.translateCreatorType)
    || (randomVal !== randomAlgoSettings.random)
    || (popularVal !== randomAlgoSettings.popular)
    || (trendingVal !== randomAlgoSettings.trending)
    || (recentVal !== randomAlgoSettings.recent)
    || (archeologistVal !== randomAlgoSettings.archeologist)
    || (supporterVal !== randomAlgoSettings.supporter)
    || (viewMaxAgeVal !== randomAlgoSettings.viewMaxAge)

  function hideModal() {
    // Reset settings to currently saved value
    setTranslateCityType(randomAlgoSettings.translateCityType);
    setTranslateCreatorType(randomAlgoSettings.translateCreatorType);
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
      translateCityType,
      translateCreatorType,
      random: randomVal,
      popular: popularVal,
      trending: trendingVal,
      recent: recentVal,
      archeologist: archeologistVal,
      supporter: supporterVal,
      viewMaxAge: viewMaxAgeVal,
    });
  }

  function resetSettings() {
    setTranslateCityType(DEFAULT_SETTINGS.translateCityType);
    setTranslateCreatorType(DEFAULT_SETTINGS.translateCreatorType);
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
          <h3 className="fs-4 mb-0">Settings</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <section id="translate-settings" className="mb-3">
            <h4 className="fs-5">Translate</h4>
            <DropdownSetting
              name="City Names"
              value={translateCityType}
              ogValue={randomAlgoSettings.translateCityType}
              setValue={setTranslateCityType}
              inputId="cityNameTranslateType"
            />
            <DropdownSetting
              name="Creator Names"
              value={translateCreatorType}
              ogValue={randomAlgoSettings.translateCreatorType}
              setValue={setTranslateCreatorType}
              inputId="creatorNameTranslateType"
            />
          </section>
          <section id="algorithm-settings">
            <h4 className="fs-5">Algorithm</h4>
            <p className="text-muted fw-normal">
              Change how should Hall of Fame (HoF) weigh the next random screenshot. Note that HoF may not respect these
              settings if it is unable to find a suitable screenshot.
            </p>
            <RangeSetting
              name="Random"
              value={randomVal}
              ogValue={randomAlgoSettings.random}
              min={0}
              max={10}
              tooltipHint="Screenshots chosen completely by random."
              setValue={setRandomVal}
              inputId="randomVal"
            />
            <RangeSetting
              name="Popular"
              value={popularVal}
              ogValue={randomAlgoSettings.popular}
              min={0}
              max={10}
              tooltipHint="Screenshots that have an above average likes/views ratio."
              setValue={setPopularVal}
              inputId="popularVal"
            />
            <RangeSetting
              name="Trending"
              value={trendingVal}
              ogValue={randomAlgoSettings.trending}
              min={0}
              max={10}
              tooltipHint="Popular screenshots that have the highest likes/views ratio, regardless of age."
              setValue={setTrendingVal}
              inputId="trendingVal"
            />
            <RangeSetting
              name="Recent"
              value={recentVal}
              ogValue={randomAlgoSettings.recent}
              min={0}
              max={10}
              tooltipHint="Recently posted screenshots (up to a few days old)"
              setValue={setRecentVal}
              inputId="recentVal"
            />
            <RangeSetting
              name="Forgotten Ones"
              value={archeologistVal}
              ogValue={randomAlgoSettings.archeologist}
              min={0}
              max={10}
              tooltipHint="Screenshots that have not seen any activity for some time."
              setValue={setArcheologistVal}
              inputId="archeologistVal"
            />
            <RangeSetting
              name="Supporter"
              value={supporterVal}
              ogValue={randomAlgoSettings.supporter}
              min={0}
              max={10}
              tooltipHint="Screenshots from Hall of Fame's members that assist the platform's development (e.g.
                    donations, being a positive contributor to the platform)."
              setValue={setSupporterVal}
              inputId="supporterVal"
            />
            <RangeSetting
              name="Minimum days until a screenshot can be shown again"
              value={viewMaxAgeVal}
              ogValue={randomAlgoSettings.viewMaxAge}
              min={0}
              max={365}
              setValue={setViewMaxAgeVal}
              inputId="viewMaxAgeVal"
            />
          </section>
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
          disabled={!isSettingsChanged}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}