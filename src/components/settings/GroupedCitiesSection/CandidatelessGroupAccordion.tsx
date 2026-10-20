import {Accordion} from "react-bootstrap";
import {Fragment, useEffect, useRef, useState} from "react";
import {GroupedCityRow} from "./GroupedCityRow.tsx";
import type {GroupedCityRowSetting} from "../../../interfaces/GroupedCityRowSetting.ts";
import {useDroppable} from "@dnd-kit/react";

export const CandidatelessGroupAccordion = (
  {creatorEntriesWithoutGroupCandidates} : {
    creatorEntriesWithoutGroupCandidates: GroupedCityRowSetting[];
  }
) => {
  const [open, setOpen] = useState(false);
  
  const {ref: headerRef, isDropTarget: isHeaderDropTarget} = useDroppable({
    id: "candidatelessGroupAccordionHeader",
  });
  
  const {ref: bodyRef, isDropTarget: isBodyDropTarget} = useDroppable({
    id: "candidatelessGroupAccordionBody",
  })
  
  const timeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isHeaderDropTarget) {
      timeoutRef.current = setTimeout(() => {
        setOpen(isHeaderDropTarget);
      }, 500);
    } else if (!isHeaderDropTarget && !isBodyDropTarget) {
      setOpen(false);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isHeaderDropTarget]);
  
  return (
    <Accordion
      activeKey={open ? ["0"] : []}
      onSelect={() => setOpen(!open)}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header
          ref={headerRef}
          className="rounded-1"
          style={isHeaderDropTarget ? {boxShadow: "0 0 0 var(--bs-focus-ring-width) rgba(255, 255, 255, var(--bs-focus-ring-opacity))"} : {}}
        >
          {isHeaderDropTarget && <span className="text-secondary me-1">(Hover to open)</span>}
          Groups with 0 group candidates
          ({creatorEntriesWithoutGroupCandidates.length} result(s))
        </Accordion.Header>
        <Accordion.Body ref={bodyRef}>
          {creatorEntriesWithoutGroupCandidates.map((
            groupedCitiesRow,
          ) => (
            <Fragment key={groupedCitiesRow.id}>
              <GroupedCityRow
                {...groupedCitiesRow}
              />
            </Fragment>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}