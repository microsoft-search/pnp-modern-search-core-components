import { LitElement, PropertyValues, html } from "lit";
import { property, state } from "lit/decorators.js";
import { BaseComponent } from "../BaseComponent";

export class ThemeProviderComponent extends LitElement {

    /**
     * The default theme to use for components on the page 
     */ 
    @property({type: String, attribute: "theme-default", reflect: true})
    defaultTheme: string;

    /**
     * The selector to use to apply theme classes
     */ 
    @property({type: String, attribute: "selector"})
    selector: string;

    @property({type: String, attribute: "background-color-dark"})
    backgroundColorDark: string;

    @property({type: String, attribute: "background-color-light"})
    backgroundColorLight: string;

    @state()
    isDark = false;

    protected override render(): unknown {
        
        const renderToggle =  html`
                <fast-switch @change=${() => this._onThemeChange(!this.isDark)} checked=${this.isDark}>
                    <span slot="checked-message" class="dark:text-white">Dark</span>
                    <span slot="unchecked-message" class="dark:text-white">Light</span>
                </fast-switch>
        `;
    
        return renderToggle;
    }

    static override get styles() {

        return [
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define theme variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    protected override firstUpdated(changedProperties: PropertyValues<this>): void {

        const defaultTheme = this.defaultTheme ? this.defaultTheme : "light";
        const element: HTMLElement = this.selector ? document.querySelector(this.selector) : document.documentElement;

        switch (localStorage.theme) {
            case "dark":
                element.classList.add("dark");

                if (this.backgroundColorDark) {
                    element.style.backgroundColor = this.backgroundColorDark;
                }

                localStorage.theme = "dark";
                this.isDark = true;

                break;

            case "light":
                element.classList.remove("dark");
                if (this.backgroundColorLight) {
                    element.style.backgroundColor = this.backgroundColorLight;
                }

                localStorage.theme = "light";
                this.isDark = false;

                break;

            default:
                localStorage.theme = defaultTheme;
        }

        super.firstUpdated(changedProperties);
    }

    private _onThemeChange(isDark: boolean) {

        const element: HTMLElement = this.selector ? document.querySelector(this.selector) : document.documentElement;

        if (isDark) { 
            element.classList.add("dark");
            if (this.backgroundColorDark) {
                element.style.backgroundColor = this.backgroundColorDark;
            }

            localStorage.theme = "dark";
            this.isDark = true;
        } else {
            element.classList.remove("dark");
            if (this.backgroundColorLight) {
                element.style.backgroundColor = this.backgroundColorLight;
            }
            
            localStorage.theme = "light";
            this.isDark = false;
        }
    }
    
}