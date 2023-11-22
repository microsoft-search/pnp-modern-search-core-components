import { html } from "lit";
import { property } from "lit/decorators.js";
import { BaseComponent } from "../../../BaseComponent";
import { ErrorMessageStrings as strings } from "../../../../loc/strings.default";

export class ErrorMessageComponent extends BaseComponent {

    @property()
    override error: Error;

    protected override render() {

        return html`
            <div class="w-full rounded-lg border-l-2 border-l-red-600 flex items-start bg-black/[0.02] p-5">
                <div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.4375C10.0222 2.4375 8.08879 3.02399 6.4443 4.1228C4.79981 5.22162 3.51809 6.7834 2.76121 8.61066C2.00433 10.4379 1.8063 12.4486 2.19215 14.3884C2.578 16.3282 3.53041 18.11 4.92894 19.5086C6.32746 20.9071 8.10929 21.8595 10.0491 22.2453C11.9889 22.6312 13.9996 22.4332 15.8268 21.6763C17.6541 20.9194 19.2159 19.6377 20.3147 17.9932C21.4135 16.3487 22 14.4153 22 12.4375C21.997 9.78625 20.9425 7.24445 19.0678 5.36974C17.193 3.49502 14.6512 2.44049 12 2.4375ZM11.2308 7.82211C11.2308 7.6181 11.3118 7.42244 11.4561 7.27819C11.6003 7.13393 11.796 7.05288 12 7.05288C12.204 7.05288 12.3997 7.13393 12.5439 7.27819C12.6882 7.42244 12.7692 7.6181 12.7692 7.82211V13.2067C12.7692 13.4107 12.6882 13.6064 12.5439 13.7507C12.3997 13.8949 12.204 13.976 12 13.976C11.796 13.976 11.6003 13.8949 11.4561 13.7507C11.3118 13.6064 11.2308 13.4107 11.2308 13.2067V7.82211ZM12 17.8221C11.7718 17.8221 11.5487 17.7544 11.359 17.6277C11.1692 17.5009 11.0213 17.3207 10.934 17.1098C10.8467 16.899 10.8238 16.667 10.8683 16.4432C10.9128 16.2193 11.0227 16.0137 11.1841 15.8524C11.3455 15.691 11.5511 15.5811 11.7749 15.5366C11.9987 15.4921 12.2307 15.5149 12.4416 15.6023C12.6524 15.6896 12.8326 15.8375 12.9594 16.0272C13.0862 16.217 13.1538 16.4401 13.1538 16.6683C13.1538 16.9743 13.0323 17.2678 12.8159 17.4842C12.5995 17.7005 12.306 17.8221 12 17.8221Z" fill="#D72C37"/>
                    </svg>
                </div>
                <div class="pl-3">
                    <p class="font-primary font-bold text-sm">${this.strings.errorMessage}</p>
                    <p class="font-sans text-sm">${this.error.message}</p>
                </div>
            </div>
        `;
    }

    static override get styles() {
        return [
            BaseComponent.themeStyles, // Allow component to use theme CSS variables from design. The component is a first level component so it is OK to define them variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    protected override get strings(): { [x: string]: string; } {
        return strings;
    }
}