import { PropertyValues, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { FileFormat } from "../../services/templateService/ITemplateService";
import { TemplateService } from "../../services/templateService/TemplateService";
import { BaseComponent } from "../BaseComponent";

/**
 * Process adaptive card content from an external file
 */
export class AdaptiveCardComponent extends BaseComponent {

    /**
     * The file URL to fetch
     */
    @property({ type: String, attribute: "url" })
    fileUrl: string;

    /**
     * The file format to load
     */
    @property({ type: String, attribute: "format" })
    fileFormat: FileFormat = FileFormat.Json;

    /**
     * The fallback image URL
     */
    @property({ type: String, attribute: "fallback-img-url" })
    fallbackImageUrl: string;

    /**
     * The data context to use to render the card
     */
    @property({type: Object, attribute: "context", converter: {
        fromAttribute: (value) => {
            try {
                return JSON.parse(value);
            } catch {
                return null;
            }
        },
    }})
    cardContext: object;

    /**
     * The raw adaptive card content as string (i.e. JSON stringified)
     */
    @property({ type: String, attribute: "content" })
    cardContent: string;

    /**
     * The file content to display
     * IMPORTANT: This must be an HTMLElement instead of a string to be able to render event listeners added dynamically by the adaptivecards library (ex: play videos).
     */
    @state()
    content: HTMLElement;

    constructor() {
        super();
    }

    override render() {

        if (this.content) {
            return html`<div class="animate-fadein ${this.theme}">${this.content}</div>`;
        } else {
            return html`
                <div class="flex justify-center space-x-2 opacity-75" >
                    <div style="animation-delay: 0.1s" class="bg-primary p-1 w-1 h-1 rounded-full animate-bounce"></div>
                    <div style="animation-delay: 0.2s" class="bg-primary p-1 w-1 h-1 rounded-full animate-bounce"></div>
                    <div style="animation-delay: 0.3s" class="bg-primary p-1 w-1 h-1 rounded-full animate-bounce"></div>
                </div>
            `;
        }
    }

    static override get styles() {
        return [
            css`
                :host {               

                    > .ac-container{
                        padding: 8px !important;
                    }

                    .ac-anchor {
                        text-decoration: none;
                        transition-property: all;
                        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                        transition-duration: 150ms;
                    }
                    .ac-textBlock{
                        white-space: normal !important;
                        overflow-wrap: break-word !important;
                    }

                    .ac-anchor:hover{
                        color: var(--pnpsearch-internal-colorPrimary);
                    }

                    .ac-anchor:focus, .ac-anchor:focus-visible{
                        color: var(--pnpsearch-internal-colorPrimary);
                    }
                }                 
            `,
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define them variables here¸
            BaseComponent.styles
        ];
    }

    public override async connectedCallback(): Promise<void> {

        const io = new IntersectionObserver(async (data) => {
 
            if (data[0].isIntersecting) {
                await this._processAdaptiveCard();                    
                io.disconnect();
            }
        });
 
        io.observe(this);       
 
        super.connectedCallback();
    }

    protected override updated(changedProperties: PropertyValues<this>): void {
    
        if (this.hasPropertyUpdated(changedProperties, "theme")) {

            // Re-render the adaptive with the new theme through adaptive card host configuration (as we can't use CSS variables in an adaptive card).
            this._processAdaptiveCard();
        }
    }

    private async _processAdaptiveCard() {

        const templateService = new TemplateService();
        await templateService.loadAdaptiveCardsResources();

        let contentToProcess: string;
        let cardContent: HTMLElement;

        if (this.cardContent) {
            contentToProcess = this.cardContent;
        } else if (this.fileUrl) {

            // Get the file raw content according to the type
            const fileContent = await templateService.getFileContent(this.fileUrl);

            if (this.fileFormat === FileFormat.Json) {   
                contentToProcess = fileContent;
            }
        }

        if (this.cardContext) {
            cardContent = templateService.processAdaptiveCardTemplate(contentToProcess, this.cardContext, this.getTheme(), this.fallbackImageUrl);          
        } else {
            const contentElement =  document.createElement("div");
            contentElement.innerHTML = contentToProcess;
            cardContent = contentElement;
        }

        this.content = cardContent;
    }
}