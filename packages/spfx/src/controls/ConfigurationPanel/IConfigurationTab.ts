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
}