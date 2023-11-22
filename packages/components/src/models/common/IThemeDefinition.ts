
export interface IThemeDefinition {
   /**
    * All CSS variables values (ex: --pnpsearch-internal-textColorDark = #FFF)
    */
   [key: string]: string | boolean;

   /**
    * Flag indicating if the theme is in dark mode
    */
   isDarkMode: boolean;
}