import {Popover} from "react-bootstrap";
import {ArrowUpRight, Eye, Heart, Images} from "react-bootstrap-icons";
import {NavLink} from "react-router";
import * as React from "react";
import {useCreator} from "../../../hooks/useCreator.ts";
import type {Creator} from "../../../interfaces/Creator.ts";

export const CreatorPreviewPopoverBody = (
  {creator, creatorName, showLinks}: {creator: Creator, creatorName: string, showLinks: boolean}
) => {
  const {data, isFetching, error} = useCreator(creator.id);

  if (data) {
    return (
      <>
        <Popover.Body>
          <h4 className="fs-5 mb-1">
            {creatorName}
          </h4>
          <p className="text-muted mb-1">
            Created at: {new Date(data.createdAt).toLocaleString()}
          </p>
          <ul className="list-unstyled mb-2">
            <li className="d-flex gap-2 align-items-center">
              <Images />
              <span className="visually-hidden">Total Screenshots</span>
              {data.screenshotsCount.toLocaleString()}
            </li>
            <li className="d-flex gap-2 align-items-center">
              <Eye />
              <span className="visually-hidden">Views</span>
              {data.viewsCount.toLocaleString()} (Unique: {data.uniqueViewsCount.toLocaleString()})
            </li>
            <li className="d-flex gap-2 align-items-center">
              <Heart />
              <span className="visually-hidden">Favorites</span>
              {`${data.favoritesCount.toLocaleString()} (${Math.round((data.favoritesCount / data.viewsCount) * 100)}% of unique views)`}
            </li>
          </ul>
          {showLinks && (
            <NavLink to={`/?creator=${data.id}`} >
              To {creatorName}'s cities
              <ArrowUpRight className="ms-2" />
            </NavLink>
          )}
        </Popover.Body>
      </>
    )
  } else {
    return (
      <>
        <Popover.Body>
          <h4 className="fs-5 mb-1">
            {creatorName}
          </h4>
          <div>Loading...</div>
        </Popover.Body>
      </>
    )
  }
}