import React from "react";
import {
    ManagedClasses,
    ViewportPositionerClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ViewportPositionerManagedClasses
    extends ManagedClasses<ViewportPositionerClassNameContract> {}
export interface ViewportPositionerUnhandledProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export enum HorizontalPosition {
    left = "left",
    right = "right",
    free = "free",
    widest = "widest",
}

export enum VerticalPosition {
    top = "top",
    bottom = "bottom",
    free = "free",
    tallest = "tallest",
}

export enum FollowMode {
    fixedAfterInitialRender = "fixedAfterInitialRender",
    followOffViewport = "followOffViewport",
    stickToViewportEdge = "stickToViewportEdge",
}

export interface ViewportPositionerHandledProps extends ViewportPositionerManagedClasses {
    /**
     * The clientRect to anchor the positioner to
     */
    anchor?: React.RefObject<HTMLDivElement>;

    /**
     * The clientRect to anchor the positioner to
     */
    anchorRect?: DOMRect | ClientRect;

    /**
     * Constrains to a sub-rect within the viewport
     */
    constraint?: React.RefObject<HTMLDivElement>;

    /**
     * Constrains to a sub-rect within the viewport
     */
    constraintRect?: DOMRect | ClientRect;

    /**
     *
     */
    minHorizontalSpace?: number;

    /**
     *
     */
    minVerticalSpace?: number;

    /**
     *
     */
    defaultHorizontalPosition?: HorizontalPosition;

    /**
     *
     */
    defaultVerticalPosition?: VerticalPosition;

    /**
     *
     */
    horizontalFollowMode?: FollowMode;

    /**
     *
     */
    verticalFollowMode?: FollowMode;

    /**
     *
     */
    constrainWidthToViewport?: boolean;

    /**
     *
     */
    constrainHeightToViewport?: boolean;

    /**
     *
     */
    updateTimerInterval?: number;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * The children of the viewport positioner
     */
    children?: React.ReactNode;
}

export type ViewportPositionerProps = ViewportPositionerHandledProps &
    ViewportPositionerUnhandledProps;
