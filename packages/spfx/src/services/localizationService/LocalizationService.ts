import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { ILocalizationService } from "./ILocalizationService";
import { SPHttpClient } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";

const LocalizationService_ServiceKey = "ModernSearchCoreLocalizationService";

export class LocalizationService implements ILocalizationService {
    
    /**
     * The current page context
     */
    private pageContext: PageContext;

    /**
     * The SPHttpClient instance
     */
    private spHttpClient: SPHttpClient;
    
    private _supportedLocales: string[];

    // Locales to match with this.context.pageContext.cultureInfo.currentUICultureName for SPFx
    public static locales = new Map<number,string>([
        [1025,"ar-SA"],
        [1026, "bg-BG"],
        [1027, "ca-ES"],
        [1028, "zh-TW"],
        [1029, "cs-CZ"],
        [1030, "da-DK"],
        [1031, "de-DE"],
        [1032, "el-GR"],
        [1033, "en-US"],
        [1035, "fi-FI"],
        [1036, "fr-FR"],
        [1037, "he-IL"],
        [1038, "hu-HU"],
        [1040, "it-IT"],
        [1041, "ja-JP"],
        [1042, "ko-KR"],
        [1043, "nl-NL"],
        [1044, "nb-NO"],
        [1045, "pl-PL"],
        [1046, "pt-BR"],
        [1048, "ro-RO"],
        [1049, "ru-RU"],
        [1050, "hr-HR"],
        [1051, "sk-SK"],
        [1053, "sv-SE"],
        [1054, "th-TH"],
        [1055, "tr-TR"],
        [1057, "id-ID"],
        [1058, "uk-UA"],
        [1060, "sl-SI"],
        [1061, "et-EE"],
        [1062, "lv-LV"],
        [1063, "lt-LT"],
        [1066, "vi-VN"],
        [1068, "az-Latn-AZ"],
        [1069, "eu-ES"],
        [1071, "mk-MK"],
        [1081, "hi-IN"],
        [1086, "ms-MY"],
        [1087, "kk-KZ"],
        [1106, "cy-GB"],
        [1110, "gl-ES"],
        [1164, "prs-AF"],
        [2052, "zh-CN"],
        [2070, "pt-PT"],
        [2074, "sr-Latn-CS"],
        [2108, "ga-IE"],
        [3082, "es-ES"],
        [5146, "bs-Latn-BA"],
        [9242, "sr-Latn-RS"],
        [10266, "sr-Cyrl-RS"],
    ]);

    public constructor(serviceScope: ServiceScope) {

        serviceScope.whenFinished(() => {

            this.pageContext = serviceScope.consume<PageContext>(PageContext.serviceKey);
            this.spHttpClient = serviceScope.consume<SPHttpClient>(SPHttpClient.serviceKey);
        });
    }
    
    public static ServiceKey: ServiceKey<ILocalizationService> = ServiceKey.create(LocalizationService_ServiceKey, LocalizationService);

    public async getSiteSupportedLocales(): Promise<string[]> {

        if (this._supportedLocales) {
            return this._supportedLocales;
        }

        // Look at missing translations on the home page of the site
        // If translations are not enabled in the site settings, supported locales array will be empty
        const response = await this.spHttpClient.get(`${this.pageContext.site.absoluteUrl}/_api/sitepages/pages?$select=Translations&$expand=Translations&$filter=IsWebWelcomePage eq true`, SPHttpClient.configurations.v1);

        if (response.ok) {
            const localesJson = await response.json();
            this._supportedLocales = localesJson.value[0].Translations.UntranslatedLanguages;
            return this._supportedLocales;
        }

        return [];
    }

    public async getCurrentPageUILanguage(): Promise<string> {

        try {

            const listId = this.pageContext.list.id;
            const itemId = this.pageContext.listItem.id;

            const response = await this.spHttpClient.post( `${this.pageContext.web.absoluteUrl}/_api/web/Lists(guid'${listId}')/RenderListDataAsStream`, SPHttpClient.configurations.v1, {
                body: JSON.stringify({
                parameters: {
                    RenderOptions: 2,
                    ViewXml:`
                            <View Scope="RecursiveAll">
                                <ViewFields>
                                    <FieldRef Name="_SPIsTranslation" />
                                    <FieldRef Name="_SPTranslatedLanguages" />
                                    <FieldRef Name="_SPTranslationLanguage" />
                                    <FieldRef Name="_SPTranslationSourceItemId" />
                                </ViewFields>
                                <Query>
                                    <Where>
                                        <Eq>
                                            <FieldRef Name="ID" />
                                            <Value Type="Number">${itemId}</Value>
                                        </Eq>
                                    </Where>
                                </Query>
                                <RowLimit />
                            </View>
                            `
                    }
                })
            });

            if (response.ok) {
                const page = await response.json();
                const pageLocale = page?.Row[0]?._SPTranslationLanguage;
                if (pageLocale) {
                    return pageLocale;
                }

                return this.pageContext.cultureInfo.currentUICultureName.toLocaleLowerCase();
            } 

        } catch(error) {
            return this.pageContext.cultureInfo.currentUICultureName.toLocaleLowerCase();
        }
    }
}