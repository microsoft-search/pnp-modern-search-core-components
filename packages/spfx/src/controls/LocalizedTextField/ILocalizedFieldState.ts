import { ILocalizedString } from "@pnp/modern-search-core/dist/es6/models/common/ILocalizedString";
import { ITranslation } from "./components/ITranslation";

export interface ILocalizedFieldState {

    /**
     * State key to force a re-render and recreation of all rows
     */
    stateKey: string;

    /**
     * Current field value
     */
    fieldValue: string | ILocalizedString;

    /**
     * The default translation for currnet locale
     */
    defaultTranslation: string;

    /**
     * List of additional translations if any
     */
    additionalTranslations: ITranslation[];
}