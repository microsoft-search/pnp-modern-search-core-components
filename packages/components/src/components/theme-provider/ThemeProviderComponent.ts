import { Switch } from "@microsoft/fast-foundation";
import { LitElement, PropertyValues, html } from "lit";
import { property, state } from "lit/decorators.js";
import { BaseComponent } from "../BaseComponent";

export class ThemeProviderComponent extends LitElement {

    /**
     * The default theme to use for components on the page 
     */ 
    @property({type: String, attribute: "theme-default", reflect: true})
    defaultTheme: string;


    @state()
    checked = false;

    protected override render(): unknown {
        
        const renderToggle =  html`
                <fast-switch @change=${this._onThemeChange} checked=${this.checked}>
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

        switch (localStorage.theme) {
            case "dark":
                document.documentElement.classList.add("dark"); 
                localStorage.theme = "dark";
                this.checked = true;

                break;

            case "light":
                document.documentElement.classList.remove("dark");
                localStorage.theme = "light";
                this.checked = false;

                break;

            default:
                localStorage.theme = defaultTheme;
        }

        super.firstUpdated(changedProperties);
    }

    private _onThemeChange(e: Event) {
        const checked = (e.target as Switch).checked;

        if (checked) { 
            document.documentElement.classList.add("dark"); 
            localStorage.theme = "dark";
            this.checked = true;
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            this.checked = false;
        }
    }
    
}