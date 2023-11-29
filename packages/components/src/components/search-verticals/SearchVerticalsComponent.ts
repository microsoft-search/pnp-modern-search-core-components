import {  PropertyValues, html } from "lit";
import { property, state } from "lit/decorators.js";
import { BaseComponent } from "../BaseComponent";
import { IDataVerticalConfiguration } from "../../models/common/IDataVerticalConfiguration";
import { repeat } from "lit/directives/repeat.js";
import { PageOpenBehavior, UrlHelper } from "../../helpers/UrlHelper";
import { ISearchVerticalEventData } from "../../models/events/ISearchVerticalEventData";
import { isEmpty, isEqual } from "lodash-es";
import { IDataVertical } from "../../models/common/IDataVertical";
import { LocalizedStringHelper } from "../../helpers/LocalizedStringHelper";
import { ComponentEventType } from "../../models/events/EventType";
import { EventConstants } from "../../common/Constants";

export class SearchVerticalsComponent extends BaseComponent {

    /**
     * The configured search verticals 
     */
    @property({type: Object, attribute: "settings", converter: {
        fromAttribute:  (value) => {
            return JSON.parse(value) as IDataVerticalConfiguration[];
        },
    }})
    verticals: IDataVerticalConfiguration[] = [];

    /**
     * The query string parameter name to use to select a vertical tab by default
     */
    @property({type: String, attribute: "default-query-string-param"})
    defaultVerticalQueryStringParam = "v";

    @property({type: String, attribute: "selected-key", reflect: true})
    selectedVerticalKey: string;

    /**
     * The current selected vertical
     */
    @state()
    selectedVertical: IDataVertical;

    static override get styles() {
        return [
            BaseComponent.themeStyles, // Allow component to use them CSS variables from design. The component is a first level component so it is OK to define theme variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    constructor() {

        super();
        this.onVerticalSelected = this.onVerticalSelected.bind(this);

    }

    public override render() {

        return html`
            <div class=${`px-2.5 ${this.theme}`}>
                <div class="max-w-7xl ml-auto mr-auto mb-8">
                    <fast-tabs activeid=${this.selectedVerticalKey} class="dark:bg-primaryBackgroundColorDark ">
                        ${repeat(
                            this.verticals, 
                            (vertical) => vertical.key, 
                            (vertical) => {
                                return html`
                                    <fast-tab
                                        data-name=${this.getLocalizedString(vertical.tabName)}
                                        data-key=${vertical.key}
                                        slot="tab" 
                                        id=${vertical.key}
                                        @click=${() => { this.onVerticalSelected(vertical); }}
                                        class="text-xl px-4 py-[18px] mr-0.5 font-primary text-textColor dark:hover:aria-selected:text-textColor dark:text-textColorDark transition-all aria-selected:font-bold">
                                        ${this.getLocalizedString(vertical.tabName)}
                                    </fast-tab>
                                    <fast-tab-panel id=${`${vertical.key}Panel`} slot="tabpanel">
                                    </fast-tab-panel>
                                `;
                            }
                        )}
                    </fast-tabs>
                </div>
            </div>
        `;
    }

    public override async connectedCallback(): Promise<void> {

       this.handleQueryStringChange();
       this.initializeDefaultValue();

        return super.connectedCallback();
    }

    public override updated(changedProperties: PropertyValues<this>): void {

        if (changedProperties.has("verticals")) {
            this.initializeDefaultValue();
        }

        super.updated(changedProperties);
    }

    /**
     * Select the vertical and notifies all subscribers
     * @param verticalKey the vertical key to select
     */
    public selectVertical(verticalKey: string) {

        if (!isEmpty(verticalKey)) {
            
            this.selectedVerticalKey = verticalKey;

            // Update the query string parameter if already present in the URL
            const verticalKeyParam = UrlHelper.getQueryStringParam(this.defaultVerticalQueryStringParam, window.location.href);
            if (this.defaultVerticalQueryStringParam && verticalKeyParam && !isEqual(this.selectedVerticalKey, verticalKeyParam)) {    
                window.history.pushState(
                    {},
                    "",
                    UrlHelper.addOrReplaceQueryStringParam(window.location.href, this.defaultVerticalQueryStringParam, this.selectedVerticalKey)
                ); 
            }

            this.selectedVertical = this.toDataVertical(this.selectedVerticalKey);

            this.fireCustomEvent(EventConstants.SEARCH_VERTICAL_EVENT, {
                selectedVertical: this.toDataVertical(verticalKey),
                eventType: ComponentEventType.UserActionEvent
            } as ISearchVerticalEventData);
        }
    }

    /**
     * Handler when a vertical is slected by an user
     * @param vertical the current selected vertical
     */
    private onVerticalSelected(vertical: IDataVerticalConfiguration): void {

        if (vertical.isLink && vertical.linkUrl) {
            window.open(vertical.linkUrl, PageOpenBehavior.NewTab ? "_blank" : "");
        } else {     
            this.selectVertical(vertical.key);
        }
    }

    /**
     * Initialize the default vertical value according to settings
     */
    private initializeDefaultValue() {

        if (!this.defaultVerticalQueryStringParam) {
            this.selectedVerticalKey = this.selectedVerticalKey ? this.selectedVerticalKey : this.verticals[0]?.key;
        
        } else {

            // Get vertical corresponding to the query string URL parameter
            const defaultQueryVal = UrlHelper.getQueryStringParam(this.defaultVerticalQueryStringParam, window.location.href.toLowerCase());

            if (defaultQueryVal) {
                const defaultSelected: IDataVerticalConfiguration[] = this.verticals.filter(v => v.key.toLowerCase() === decodeURIComponent(defaultQueryVal.toLowerCase()));
                if (defaultSelected.length === 1) {
                    this.selectedVerticalKey = defaultSelected[0].key;
                }
            } else {
                this.selectedVerticalKey = this.selectedVerticalKey ? this.selectedVerticalKey : this.verticals[0]?.key;
            }
        }

        if (this.selectedVerticalKey) {
            this.selectedVertical = this.toDataVertical(this.selectedVerticalKey);

            this.fireCustomEvent(EventConstants.SEARCH_VERTICAL_EVENT, {
                selectedVertical: this.selectedVertical,
                eventType: ComponentEventType.InitializationEvent
            } as ISearchVerticalEventData);
        }
    }

    /**
     * Subscribes to URL query string change events using windows state
     */
    private handleQueryStringChange() {

        if (this.defaultVerticalQueryStringParam) {
  
            // Will fire on browser back/forward
            window.onpopstate = () => {
                const verticalKeyParam = UrlHelper.getQueryStringParam(this.defaultVerticalQueryStringParam, window.location.href);
                if (this.selectedVerticalKey !== verticalKeyParam)
                this.selectVertical(verticalKeyParam);
            };
        }
    }

    private toDataVertical(verticalKey: string): IDataVertical {

        const verticalConfiguration = this.verticals.filter(v => v.key === verticalKey)[0];

        return {
            key: verticalConfiguration.key,
            name: LocalizedStringHelper.getDefaultValue(verticalConfiguration.tabName),
            value: verticalConfiguration.tabValue
        };
    }
}