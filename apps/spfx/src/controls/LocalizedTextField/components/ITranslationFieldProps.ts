import { IDropdownOption } from "office-ui-fabric-react";
import { ITranslation } from "./ITranslation";

export interface ITranslationFieldProps {

    /**
     * The list of supported locales to display
     */
    supportedLocales: IDropdownOption[];

    /**
     * Disabled option keys if nay
     */
    disabledLocales?: string[];

    /**
     * The default value
     */
    defaultValue?: ITranslation;

    /**
     * Callback handler when the translation is updated
     * @param value the new value
     */
    onChange: (value: ITranslation) => void;
}