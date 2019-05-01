import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get, isEqual, isNil } from "lodash-es";
import { ViewportPositionerClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    FollowMode,
    HorizontalPosition,
    VerticalPosition,
    ViewportPositionerHandledProps,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
} from "./viewport-positioner.props";
import { DisplayNamePrefix } from "../utilities";

export interface ViewportPositionerState {
    disabled: boolean;
    transformOrigin: string;
    transform: string;
    constrainedHeight: number;
    constrainedWidth: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

class ViewportPositioner extends Foundation<
    ViewportPositionerHandledProps,
    ViewportPositionerUnhandledProps,
    ViewportPositionerState
> {
    public static displayName: string = `${DisplayNamePrefix}ViewportPositioner`;

    public static defaultProps: Partial<ViewportPositionerProps> = {
        horizontalFollowMode: FollowMode.followOffViewport,
        verticalFollowMode: FollowMode.followOffViewport,
        defaultHorizontalPosition: HorizontalPosition.free,
        defaultVerticalPosition: VerticalPosition.free,
        constrainHeightToViewport: false,
        constrainWidthToViewport: false,
        updateTimerInterval: 10,
    };

    protected handledProps: HandledProps<ViewportPositionerHandledProps> = {
        managedClasses: void 0,
        anchor: void 0,
        anchorRect: void 0,
        disabled: void 0,
        constraint: void 0,
        constraintRect: void 0,
        minHorizontalSpace: void 0,
        minVerticalSpace: void 0,
        defaultHorizontalPosition: void 0,
        defaultVerticalPosition: void 0,
        horizontalFollowMode: void 0,
        verticalFollowMode: void 0,
        constrainWidthToViewport: void 0,
        constrainHeightToViewport: void 0,
        updateTimerInterval: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private updateTimer: NodeJS.Timer;
    private updateTimerActive: boolean = false;
    private openRequestAnimationFrame: number = null;

    /**
     * constructor
     */
    constructor(props: ViewportPositionerProps) {
        super(props);

        this.state = {
            disabled: true,

            transformOrigin: "",
            transform: "",
            constrainedHeight: null,
            constrainedWidth: null,
            top: null,
            right: null,
            bottom: null,
            left: null,
        };
    }

    public componentDidMount(): void {
        this.checkComponentConfig();
        this.requestFrame();
    }

    public componentWillUnmount(): void {
        this.disableComponent();
    }

    public componentDidUpdate(prevProps: ViewportPositionerProps): void {
        if (
            isNil(prevProps.anchorRect) !== isNil(this.props.anchorRect) ||
            isNil(prevProps.constraintRect) !== isNil(this.props.constraintRect) ||
            isNil(prevProps.anchor) !== isNil(this.props.anchor) ||
            isNil(prevProps.constraint) !== isNil(this.props.constraint) ||
            prevProps.disabled !== this.props.disabled
        ) {
            this.checkComponentConfig();
        }

        if (
            !isEqual(prevProps.anchorRect, this.props.anchorRect) ||
            !isEqual(prevProps.constraintRect, this.props.constraintRect)
        ) {
            this.requestFrame();
        }
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                ref={this.rootElement}
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                style={this.getPositioningStyles()}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        const classNames: string = get(this.props, "managedClasses.sliderTrackItem", "");

        return super.generateClassNames(classNames);
    }

    /**
     *
     */
    private getPositioningStyles = (): {} => {
        if (this.state.disabled) {
            return null;
        }

        return {
            position: "fixed",
            transformOrigin: this.state.transformOrigin,
            transform: this.state.transform,
            height:
                this.state.constrainedHeight === null
                    ? null
                    : `${this.state.constrainedHeight}px`,
            width:
                this.state.constrainedWidth === null
                    ? null
                    : `${this.state.constrainedWidth}px`,
            top: this.state.top === null ? null : `${this.state.top}px`,
            right: this.state.right === null ? null : `${this.state.right}px`,
            bottom: this.state.bottom === null ? null : `${this.state.bottom}px`,
            left: this.state.left === null ? null : `${this.state.left}px`,
            background: "red",
        };
    };

    /**
     *
     */
    private checkComponentConfig = (): void => {
        if (
            this.props.disabled === true ||
            (isNil(this.props.anchor) && isNil(this.props.anchorRect))
        ) {
            this.disableComponent();
            return;
        }

        if (
            isNil(this.props.anchorRect) ||
            (isNil(this.props.constraintRect) && !isNil(this.props.constraint))
        ) {
            this.enableUpdateTimer();
        } else {
            this.disableUpdateTimer();
        }
        this.enableComponent();
        this.requestFrame();
    };

    private enableComponent = (): void => {
        if (!this.state.disabled) {
            return;
        }
        window.addEventListener("resize", this.onResize);
        this.setState({
            disabled: false,
        });
    };

    private disableComponent = (): void => {
        if (this.state.disabled) {
            return;
        }
        this.setState({
            disabled: true,
        });
        if (this.openRequestAnimationFrame !== null) {
            window.cancelAnimationFrame(this.openRequestAnimationFrame);
            this.openRequestAnimationFrame = null;
        }
        window.removeEventListener("resize", this.onResize);
        this.disableUpdateTimer();
    };

    /**
     *
     */
    private enableUpdateTimer = (): void => {
        if (this.updateTimerActive) {
            return;
        }
        this.updateTimer = setTimeout((): void => {
            this.updateTimerExpired();
        }, this.props.updateTimerInterval);
        this.updateTimerActive = true;
    };

    /**
     *  Increment timer tick
     */
    private updateTimerExpired = (): void => {
        this.requestFrame();
        this.updateTimer = setTimeout((): void => {
            this.updateTimerExpired();
        }, this.props.updateTimerInterval);
    };

    /**
     *
     */
    private disableUpdateTimer = (): void => {
        if (!this.updateTimerActive) {
            return;
        }
        clearTimeout(this.updateTimer);
        this.updateTimerActive = false;
    };

    /**
     *
     */
    private onResize = (e: UIEvent): void => {
        this.requestFrame();
    };

    private getAnchorRect = (): DOMRect | ClientRect => {
        if (!isNil(this.props.anchorRect)) {
            return this.props.anchorRect;
        }

        if (isNil(this.props.anchor.current)) {
            return new DOMRect();
        }

        return this.props.anchor.current.getBoundingClientRect();
    };

    /**
     *
     */
    private updateLayout = (): void => {
        if (this.state.disabled) {
            return;
        }

        const anchorRect: DOMRect | ClientRect = this.getAnchorRect();

        const spaceAbove: number = anchorRect.top;
        const spaceBelow: number =
            document.documentElement.clientHeight - anchorRect.bottom;
        const spaceLeft: number = anchorRect.left;
        const spaceRight: number =
            document.documentElement.clientWidth - anchorRect.right;

        let constrainedHeight: number = null;
        let constrainedWidth: number = null;
        let top: number = null;
        let right: number = null;
        let bottom: number = null;
        let left: number = null;
        let xTransform: number = 0;
        let yTransform: number = 0;
        let xTransformOrigin: string = "left";
        let yTransformOrigin: string = "top";

        let desiredVerticalPosition: VerticalPosition = this.props
            .defaultVerticalPosition;
        let desiredHorizontalPosition: HorizontalPosition = this.props
            .defaultHorizontalPosition;

        if (this.props.defaultHorizontalPosition !== HorizontalPosition.free) {
            if (
                desiredHorizontalPosition === HorizontalPosition.widest ||
                (desiredHorizontalPosition === HorizontalPosition.left &&
                    spaceLeft < this.props.minHorizontalSpace) ||
                (desiredHorizontalPosition === HorizontalPosition.right &&
                    spaceRight < this.props.minHorizontalSpace)
            ) {
                desiredHorizontalPosition =
                    spaceLeft > spaceRight
                        ? HorizontalPosition.left
                        : HorizontalPosition.right;
            }

            if (desiredHorizontalPosition === HorizontalPosition.left) {
                xTransformOrigin = "right";
                xTransform = anchorRect.right;
                right = 0;
                constrainedWidth = this.props.constrainWidthToViewport ? spaceLeft : null;
            } else {
                xTransform = anchorRect.right;
                left = 0;
                constrainedWidth = this.props.constrainWidthToViewport
                    ? spaceRight
                    : null;
            }
        }

        if (this.props.defaultVerticalPosition !== VerticalPosition.free) {
            if (
                desiredVerticalPosition === VerticalPosition.tallest ||
                (desiredVerticalPosition === VerticalPosition.top &&
                    spaceAbove < this.props.minVerticalSpace) ||
                (desiredVerticalPosition === VerticalPosition.bottom &&
                    spaceBelow < this.props.minVerticalSpace)
            ) {
                desiredVerticalPosition =
                    spaceAbove > spaceBelow
                        ? VerticalPosition.top
                        : VerticalPosition.bottom;
            }

            if (desiredVerticalPosition === VerticalPosition.top) {
                yTransformOrigin = "bottom";
                yTransform = -(document.documentElement.clientHeight - anchorRect.top);
                bottom = 0;
                constrainedHeight = this.props.constrainHeightToViewport
                    ? spaceAbove
                    : null;
            } else {
                yTransform = anchorRect.bottom;
                top = 0;
                constrainedHeight = this.props.constrainHeightToViewport
                    ? spaceBelow
                    : null;
            }
        }

        this.setState({
            transformOrigin: `${xTransformOrigin} ${yTransformOrigin}`,
            transform: `translate(${Math.floor(xTransform)}px, ${Math.floor(
                yTransform
            )}px)`,
            constrainedWidth,
            constrainedHeight,
            top,
            right,
            bottom,
            left,
        });

        this.openRequestAnimationFrame = null;
    };

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestFrame = (): void => {
        if (this.openRequestAnimationFrame === null) {
            this.openRequestAnimationFrame = window.requestAnimationFrame(
                this.updateLayout
            );
        }
    };
}

export default ViewportPositioner;
export * from "./viewport-positioner.props";
export { ViewportPositionerClassNameContract };
