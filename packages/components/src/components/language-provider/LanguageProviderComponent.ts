import { css, html, PropertyValues, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { BaseComponent } from "../BaseComponent";
import { LanguageProvider } from "./LanguageProvider";
import { getSvg, SvgIcon } from "@microsoft/mgt-components/dist/es6/utils/SvgHelper";
import { ThemeInternalCSSVariables } from "../../common/Constants";

export class LanguageProviderComponent extends BaseComponent {

    /**
     * The default locale to use for components on the page 
     */ 
    @property({type: String, attribute: "locale", reflect: true})
    defaultLocale: string;

    /**
     * Use this property for testing purpose to select a specific locale
     */
    @property({type: Boolean, attribute: "show-picker"})
    showLanguagePicker: boolean;

    declare languageProvider: LanguageProvider;

    constructor() {
        super();

        this.languageProvider = new LanguageProvider();
        this._onSelectLanguage = this._onSelectLanguage.bind(this);
    }

    static override get styles() {

        return [
            css`
            :host {

                svg, svg > path {
                    ${unsafeCSS(`fill: var(${ThemeInternalCSSVariables.textColor})`)};
                    height: 100%;
                    width: 100%;
                }

                .dark {
                    svg, svg > path {
                        ${unsafeCSS(`fill: var(${ThemeInternalCSSVariables.textColorDark})`)};
                    } 
                }     
            }                 
            `,
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define theme variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    public override render() {

        if (this.showLanguagePicker) {
            return html`
                <div class=${`${this.theme} flex items-center space-x-2`}>
                    ${getSvg(SvgIcon.Globe)}
                    <fast-select 
                        name="Locales" 
                        id="locales" 
                        @change=${this._onSelectLanguage}
                    >
                        <fast-option value="default">
                            <div class="dark:text-textColorDark text-textColor">Default</div>
                        </fast-option>
                        <fast-option value="fr-fr">
                            <div class="dark:text-textColorDark text-textColor">French</div>
                        </fast-option>
                    </fast-select>
                </div>
            `;
        } else {
            return null;
        }
    }

    private _onSelectLanguage(e: Event) {
        this.defaultLocale = (e.target as HTMLSelectElement).value;
    }

    protected override updated(changedProperties: PropertyValues<this>): void {
        if (changedProperties.has("defaultLocale")) {
            this.languageProvider.setLanguage(this.defaultLocale);
        }

        super.updated(changedProperties);
    }

    public override async connectedCallback(): Promise<void> {
        
        await this.languageProvider.setLanguage(this.defaultLocale); 
        return super.connectedCallback();
    }
}