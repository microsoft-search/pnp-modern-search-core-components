import { ICustomColorField } from "./ICustomPalette";
import { IFilePickerResult } from "@pnp/spfx-controls-react";
import { LayoutRenderType } from "./ILayoutDefinition";
import { ILayoutSlot } from "./ILayoutSlot";

export interface IBaseWebPartProps {

    /**
     * The selected layout key
     */
    selectedLayoutKey: string;

    /**
     * Content of the template if customized inline (i.e. without external file of custom layout)
     */
    inlineTemplateContent: string;

    /**
     * External template URL
     */
    externalTemplateFilePickerResult: IFilePickerResult;

    /**
     * Enables the debug mode on component
     */
    enableDebugMode: boolean;

    /**
     * The layout properties
     */
    layoutProperties: {


        slots?: ILayoutSlot[];

        /**
         * Any other property from layouts (builtin + custom)
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };

    /**
     * The layout type
     */
    layoutRenderType: LayoutRenderType;

    /**
     * The link URL to the solution documenation
     */
    documentationLink: string;

    /**
     * The Web Part title
     */
    title: string;

    /**
     * If the component should follow the site theme automatically
     */
    followSiteTheme: boolean;

    /**
     * The primary color of the component
     */
    colorOverrides: ICustomColorField[];
}