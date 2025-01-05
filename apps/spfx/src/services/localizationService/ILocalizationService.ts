export interface ILocalizationService {

    /**
     * Gets all supported locales (available translations) according to site settings
     */
    getSiteSupportedLocales(): Promise<string[]>;
    
    /**
     * Returns the current page locale (ex: fr-fr) regarding if it is a translation or not. In the latter, the current UI locale is returned. 
     */
    getCurrentPageUILanguage(): Promise<string>;
}