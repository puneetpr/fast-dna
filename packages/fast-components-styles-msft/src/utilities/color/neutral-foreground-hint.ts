import { DesignSystem, DesignSystemResolver } from "../../design-system";
import { findSwatchIndex, Palette, palette, PaletteType } from "./palette";
import { neutralForegroundRest } from "./neutral-foreground";
import { inRange } from "lodash-es";
import {
    colorRecipeFactory,
    contrast,
    Swatch,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import { backgroundColor } from "../design-system";

function neutralForegroundHintAlgorithm(
    targetContrast: number
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const contrastTarget: number = targetContrast;
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
        const neutralPaletteLength: number = neutralPalette.length;
        const neutralForegroundIndex: number = findSwatchIndex(
            PaletteType.neutral,
            neutralForegroundRest(designSystem)
        )(designSystem);
        const direction: 1 | -1 =
            neutralForegroundIndex <= Math.floor(neutralPaletteLength / 2) ? 1 : -1;
        const background: Swatch = backgroundColor(designSystem);

        let neutralForegroundHintIndex: number =
            direction === 1 ? 0 : neutralPaletteLength - 1;

        while (
            inRange(neutralForegroundHintIndex + direction, 0, neutralPaletteLength) &&
            contrast(background, neutralPalette[neutralForegroundHintIndex + direction]) >
                contrastTarget
        ) {
            neutralForegroundHintIndex = neutralForegroundHintIndex + direction;
        }

        return neutralPalette[neutralForegroundHintIndex];
    };
}

/**
 * Hint text for normal sized text, less than 18pt normal weight
 */
export const neutralForegroundHint: SwatchRecipe = colorRecipeFactory(
    neutralForegroundHintAlgorithm(4.5)
);

/**
 * Hint text for large sized text, greater than 18pt or 16pt and bold
 */
export const neutralForegroundHintLarge: SwatchRecipe = colorRecipeFactory(
    neutralForegroundHintAlgorithm(3)
);
