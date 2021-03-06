import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import { applyFloatingCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { designUnit } from "../utilities/design-system";

const styles: ComponentStyles<ContextMenuClassNameContract, DesignSystem> = {
    contextMenu: {
        background: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string => designSystem.backgroundColor
        ),
        ...applyFloatingCornerRadius(),
        ...applyElevation(ElevationMultiplier.e11),
        margin: "0",
        padding: format("{0} 0", toPx<DesignSystem>(designUnit)),
        maxWidth: "368px",
        minWidth: "64px",
        transition: "all 0.2s ease-in-out",
    },
};

export default styles;
