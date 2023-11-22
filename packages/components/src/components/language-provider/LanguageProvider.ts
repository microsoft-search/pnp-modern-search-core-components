import { LocalizationHelper } from "@microsoft/mgt-element/dist/es6/utils/LocalizationHelper";
import { strings } from "../../loc/strings.default";
import { DateHelper } from "../../helpers/DateHelper";

export class LanguageProvider {

    private dateHelper: DateHelper;

    constructor() {
        this.dateHelper = new DateHelper();
    }

    public async setLanguage(locale: string): Promise<void> {

        if (locale) {

            try {

                // Load locale file dynamically
                const localizedResources = await import(
                    /* webpackChunkName: "pnp-modern-search-core-[request]" */
                    /* webpackExports: ["strings"] */
                    /* webpackMode: "lazy-once" */
                    `../../loc/strings.${locale}`
                );

                await this.dateHelper.dayJs(locale);
                
                if (localizedResources) {
                    LocalizationHelper.strings = localizedResources.strings;
                }
            
            } catch (error) {

                LocalizationHelper.strings = strings as any;
                await this.dateHelper.dayJs("en-us");
                console.warn(`"${locale}" not found. Fallback to default.`);
            }
        }
    }
}