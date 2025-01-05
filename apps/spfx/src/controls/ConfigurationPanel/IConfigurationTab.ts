import { IConfigurationTabField } from "./IConfigurationTabField";

export interface IConfigurationTab {

    /**
     * Name of the tab
     */
    name: string;

    /**
     * Fields contained in this tab
     */
    fields: IConfigurationTabField[];

    /**
     * Handler to determine the visibility of the tab based on the current data
     * @param dataObject the current for data object
     * @returns 'true' if the field should be visible, 'false' otherwise
     */
    isVisible?: (dataObject: unknown) => boolean;
}