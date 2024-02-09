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
                    /* webpackChunkName: "pnp-modern-search-core-languages" */
                    /* webpackExports: ["strings"] */
                    /* webpackMode: "lazy" */
                    `../../loc/strings.${locale}.js`
                );

                await this.dateHelper.dayJs(locale);
                
                if (localizedResources) {
                    LocalizationHelper.strings = localizedResources.strings;
                }
            
            } catch (error) {

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                LocalizationHelper.strings = strings as any;
                await this.dateHelper.dayJs("en-us");
                console.warn(`"${locale}" not found. Fallback to default.`);
            }
        }
    }
}