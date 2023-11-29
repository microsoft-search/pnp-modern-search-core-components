export class DateHelper {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private dayJsLibrary: any;

    /**
     * Creates or returns instance of the dayJs library
     * @returns instance of the dayJs library
     */
    public async dayJs(culture?: string): Promise<unknown> {

        if (!this.dayJsLibrary) {
            
            const dayjs = await import(
                /* webpackChunkName: "pnp-modern-search-core-dayjs" */
                "dayjs/esm"
            );

            const localizedFormat = await import(
                /* webpackChunkName: "pnp-modern-search-core-dayjs" */
                "dayjs/esm/plugin/localizedFormat"
            );

            const utc = await import(
                /* webpackChunkName: "pnp-modern-search-core-dayjs" */
                "dayjs/esm/plugin/utc"
            );

            const relativeTime = await import(
                 /* webpackChunkName: "pnp-modern-search-core-dayjs" */
                "dayjs/esm/plugin/relativeTime"
            );

            this.dayJsLibrary = dayjs.default;
            this.dayJsLibrary.extend(localizedFormat.default);
            this.dayJsLibrary.extend(utc.default);
            this.dayJsLibrary.extend(relativeTime.default);
        }

        if (culture) {
            await this.setLocale(culture ? culture.toLocaleLowerCase() : "en-us");
        }
          
        return this.dayJsLibrary;
    }

    private async setLocale(locale: string): Promise<void> {

        const twoLetterLanguageName = [
            "af", "az", "be", "bg", "bm", "bo", "br", "bs", "ca", "cs", "cv",
            "cy", "da", "de-de", "dv", "el", "eo", "es-es", "et", "eu", "fa", "fi", "fil",
            "fo", "fy", "fr-fr", "ga", "gd", "gl", "gu", "he", "hi", "hr", "hu", "id", "is",
            "it-it", "ja", "jv", "ka", "kk", "km", "kn", "ko", "ku", "ky", "lb", "lo", "lt",
            "lv", "me", "mi", "mk", "ml", "mn", "mr", "mt", "my", "nb", "ne",
            "nn", "nl-nl", "pl", "pt-pt", "ro", "ru", "sd", "se", "si", "sk", "sl", "sq",
            "ss", "sv", "sw", "ta", "te", "tet", "tg", "th", "tk", "tlh",
            "tr", "tzl", "uk", "ur", "vi", "yo"
        ];

        // DayJs is by default "en-us"
        if (!locale.startsWith("en-us")) {
            
            for (let i = 0; i < twoLetterLanguageName.length; i++)
                if (locale.startsWith(twoLetterLanguageName[i])) {
                    locale = locale.split("-")[0];
                    break;
                }

            await import(
                /* webpackChunkName: "pnp-modern-search-core-dayjs" */
                `dayjs/esm/locale/${locale}.js`
            );
        }

        this.dayJsLibrary.locale(locale);
    }

    public isDST() {
        const today = new Date();
        const jan = new Date(today.getFullYear(), 0, 1);
        const jul = new Date(today.getFullYear(), 6, 1);
        const stdTimeZoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        return today.getTimezoneOffset() < stdTimeZoneOffset;
    }

    public addMinutes(isDst: boolean, date: Date, minutes: number, dst: number) {
        if (isDst) {
            minutes += dst;
        }
        return new Date(date.getTime() + minutes * 60000);
    }
}