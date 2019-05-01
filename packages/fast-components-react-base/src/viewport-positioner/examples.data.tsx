import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./viewport-positioner";
import ViewportPositioner, {
    ViewportPositionerHandledProps,
    ViewportPositionerManagedClasses,
} from "./viewport-positioner";
import Documentation from "./.tmp/documentation";

const managedClasses: ViewportPositionerManagedClasses = {
    managedClasses: {
        viewportPositioner: "viewportPositioner",
    },
};

const examples: ComponentFactoryExample<ViewportPositionerHandledProps> = {
    name: "Viewport positioner",
    component: ViewportPositioner,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
    },
    data: [
        {
            ...managedClasses,
        },
    ],
};

export default examples;
