import { ServiceScope } from "@microsoft/sp-core-library";
import { ILocalizedString } from "pnp-modern-search-core/dist/es6/models/common/ILocalizedString";

export interface ILocalizedFieldProps {

    /**
     * SPFx service scope to resolve services
     */
    serviceScope: ServiceScope;

    /**
     * Label of the field
     */
    label?: string;

    /**
     * The default value for this field
     */
    defaultValue?: string | ILocalizedString;

    /**
     * Callback handler when the field value is updated 
     * @param value The new value
     */
    onChange: (value: string | ILocalizedString) => void;

    /**
     * Error 
     */
    onGetErrorMessage?: (value: string) => string;

    /**
     * If the field is required
     */
    required?: boolean;
}