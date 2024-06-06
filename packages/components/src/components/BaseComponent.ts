
import { EventHandler, LocalizationHelper, MgtTemplatedTaskComponent } from "@microsoft/mgt-element";
import { css, CSSResultGroup, html, PropertyValueMap, PropertyValues, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ErrorTypes, EventConstants, ThemeDefaultCSSVariablesValues, ThemeInternalCSSVariables, ThemePublicCSSVariables } from "../common/Constants";
import { IComponentBinding } from "../models/common/IComponentBinding";
import { IThemeDefinition } from "../models/common/IThemeDefinition";
import { isEmpty, isEqual, isObjectLike } from "lodash-es";
import { ILocalizedString } from "../models/common/ILocalizedString";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { sanitizeSummary } from "../helpers/SearchResultsHelper";
import "@open-wc/dedupe-mixin";
import { 
    SwatchRGB, 
    accentFillRest,
    accentFillHover,
    baseLayerLuminance,
    fastAnchoredRegion, 
    fastBadge, 
    fastButton, 
    fastMenu, 
    fastMenuItem, 
    fastOption, 
    fastSearch, 
    fastSelect, 
    fastSwitch, 
    fastTab, 
    fastTabPanel, 
    fastTabs, 
    provideFASTDesignSystem, 
    StandardLuminance,
    fastToolbar,
    neutralFillRest,
    accentFillActive,
    neutralFillStealthRest,
    fillColor,
    fastDivider,
    fastProgressRing,
    neutralForegroundRest,
    neutralFillInputRest,
} from "@microsoft/fast-components";
import { styles as tailwindStyles } from "../styles/tailwind-styles-css";
import { parseColorHexRGB,  } from "@microsoft/fast-colors";
import { accentForegroundRest, neutralFillStealthRest as neutralFillStealthRestFluent } from "@fluentui/web-components";

provideFASTDesignSystem(this).register(
    fastTab(),
    fastTabPanel(),
    fastTabs(),
    fastSelect(), 
    fastOption(),
    fastButton(),
    fastSearch(),
    fastMenu(),
    fastMenuItem(),
    fastAnchoredRegion(),
    fastBadge(),
    fastSearch(),
    fastSwitch(),
    fastToolbar(),
    fastDivider(),
    fastProgressRing()
);

export class MgtTemplatedComponentBase extends MgtTemplatedTaskComponent  { 
}

export abstract class BaseComponent extends ScopedElementsMixin(MgtTemplatedComponentBase) {
   
    @property({type: String, attribute: "theme", reflect: true})
    theme;

    /**
     * Enable the debug to explore data from context
     */
    @property({type: Boolean, attribute: "enable-debug"})
    enableDebugMode = false;

    /**
     * Enable the debug to explore data from context
     */
    @property({type: Boolean, attribute: "use-mgt", reflect: true})
    useMicrosoftGraphToolkit = false;

    /**
     * Flag indicating if data have been rendered at least once
     */
    @state()
    renderedOnce = false;

    /**
     * Flag indicating if debug data should be displayed
     */
    @state()
    showDebugData = false;

    /**
     * Property indicating the component has finished its initialization squence, for instance setting default values than can be read from other component
     * This property is set as reflected attribute to be able to trigger a mutation for consumer components
     */
    @property({type: Boolean, attribute: "initialized", reflect: true})
    isInitialized = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    declare public _eventHanlders: Map<string, {component: HTMLElement, event: string, handler: EventHandler<any>}>;

    declare public componentError: Error;
    
    constructor() {
        super();

        this.toggleDebugData = this.toggleDebugData.bind(this);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._eventHanlders = new Map<string, {component: HTMLElement, event: string, handler: EventHandler<any>}>();            
    }
    
    /**
     * Returns Tailwind CSS base styles
     */
    static override get styles(): CSSResultGroup {
        return [
            tailwindStyles
        ];
    }

    static get scopedElements() { 
        return {
        }; 
    }

    /**
     * Returns styles from theme (i.e. define CSS variables)
     */
    static get themeStyles() {

        // Only first level components should use these styles (i.e. components intended to be adde directly to an host application). Nested components will inherit from variables 
        // If you use these styles in nested components, variables will be overriden and parent ones wont apply
        return [
                css`
                    :host {
                       ${unsafeCSS(`${ThemeInternalCSSVariables.fontFamilyPrimary}: var(${ThemePublicCSSVariables.fontFamilyPrimary}, ${ThemeDefaultCSSVariablesValues.defaultFontFamilyPrimary})`)}; 
                       ${unsafeCSS(`${ThemeInternalCSSVariables.fontFamilySecondary}: var(${ThemePublicCSSVariables.fontFamilySecondary}, ${ThemeDefaultCSSVariablesValues.defaultFontFamilySecondary})`)}; 
                       ${unsafeCSS(`${ThemeInternalCSSVariables.colorPrimary}: var(${ThemePublicCSSVariables.colorPrimary}, ${ThemeDefaultCSSVariablesValues.defaultColorPrimary})`)}; 
                       ${unsafeCSS(`${ThemeInternalCSSVariables.colorPrimaryHover}: var(${ThemePublicCSSVariables.colorPrimaryHover}, ${ThemeDefaultCSSVariablesValues.defaultColorPrimaryHover})`)}; 
                       ${unsafeCSS(`${ThemeInternalCSSVariables.textColor}: var(${ThemePublicCSSVariables.textColor}, ${ThemeDefaultCSSVariablesValues.defaultTextColor})`)};
                       ${unsafeCSS(`${ThemeInternalCSSVariables.textLight}: ${ThemeDefaultCSSVariablesValues.defaultTextLight}`)};
                       ${unsafeCSS(`${ThemeInternalCSSVariables.primaryBackgroundColorDark}: var(${ThemePublicCSSVariables.primaryBackgroundColorDark}, ${ThemeDefaultCSSVariablesValues.primaryBackgroundColorDark})`)};
                       ${unsafeCSS(`${ThemeInternalCSSVariables.textColorDark}: var(${ThemePublicCSSVariables.textColorDark}, ${ThemeDefaultCSSVariablesValues.textColorDark})`)};                 
                    } 
                `
        ] as CSSResultGroup;
        
    }

    public override disconnectedCallback(): void {
        
        super.disconnectedCallback();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of this._eventHanlders.entries()) {
            value.component.removeEventListener(value.event, value.handler);
        }
    }

    public override async connectedCallback(): Promise<void> {

        super.connectedCallback();

        // Register helper functions to be used in templates (data-props)
        this.templateContext = {
            ...this.templateContext,
            sanitizeSummary: sanitizeSummary
        };

         // Set the theme automatically if a parent has the "dark" CSS class or theme
        // This avoid to set explicitly the 'theme' property for each component
        const setDarkModeClass = () => {
            if (this.parentElement) {
                const parentInDarkMode = this.parentElement.closest("[class~=dark],[theme~=dark]");
                if (parentInDarkMode) {
                    this.theme = "dark";
                } else {
                    this.theme = "light";
                }

                this.requestUpdate();
            }
        };

        setDarkModeClass();

        const darkModeobserver = new MutationObserver(() => {
            setDarkModeClass();
        });

        darkModeobserver.observe(
            document.body, {attributes: true, childList: true, subtree: true }
        );

        // Indicates component has finished its initalization sequence and default values if nay can be read
        this.isInitialized = true;

        return;
    }

    /**
     * Register Microsoft Graph Toolkit Components on the page
     */
    protected async loadMgt(): Promise<void> {

        const  { registerMgtComponents } = await import(
            /* webpackChunkName: "pnp-mgt" */
            /* webpackMode: "lazy" */
            "@microsoft/mgt"
        ); 

        registerMgtComponents();
    }

    // Type fixing to be able to use 'nothing' lit symbol
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected override render(): any {
        return super.render();
    }

    protected renderDebugMode() {

        return  html`
                <div data-ref="debug-mode-bar" class="mb-2 rounded shadow-filtersShadow flex text-sm text-primary justify-between p-2">
                    <a @click=${this.toggleDebugData} href="#" data-ref="debug-mode-bar-button">   
                        <div class="flex items-center space-x-1 font-primary">
                            <span>${this.showDebugData ? "Hide debug data" : "Show debug data"}</span>
                        </div>
                    </a>
                </div>`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected renderDebugData(data: any) {
        return html`<pnp-monaco-editor class="relative h-[65vh] w-full block" .value=${data}></pnp-monaco-editor>`;
    }

    private toggleDebugData() {
        this.showDebugData = !this.showDebugData;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected override updated(changedProperties: PropertyValues<this>): void {
            
        // Needed for components not having FAST elements not available at connected callback
        this.setFASTColors();

        if (changedProperties.has("useMicrosoftGraphToolkit") && this.useMicrosoftGraphToolkit) {

            this.loadMgt().then(() => {
                this.requestUpdate();
                this.fireCustomEvent(EventConstants.SEARCH_MGT_COMPONENTS_LOADED);
            });
        }

        super.updated(changedProperties);
    }

    /**
     * Binds all connected to the current one by listening all required events.
     * The method will wait for the component to be present on the page after a predefined timeout (default 5000ms)  
     * @param bindings the bindings to perform
     */
    protected async bindComponents(bindings: IComponentBinding[]): Promise<void> {

        const bindingPromises = bindings.map(binding => {
            
            if (binding.id) {
                // This promise won't reject but log error message in the console if element not found
                return this.waitForElement(binding, 10000);
            } else {
                return Promise.resolve();
            }
            
        });

        // Wait for all bindings completed before moving on
        await Promise.all(bindingPromises);

        return;
    }

    protected unbindComponents(bindings: IComponentBinding[]) {
     
        bindings.forEach(binding => {

            const eventKey = `${binding.id}-${binding.eventName}`;
            const eventHandlerInfo = this._eventHanlders.get(eventKey);

            if (eventHandlerInfo) {  
                console.info(`Unbinding ${binding.id} from ${this.id}`);
                eventHandlerInfo.component.removeEventListener(eventHandlerInfo.event, eventHandlerInfo.handler);
                this._eventHanlders.delete(eventKey);
            }
        });  
    }

    /**
     * Get CSS variables values for the component predefined variables
     * @returns the theme definition
     */
    protected getTheme(): IThemeDefinition {

        const theme: IThemeDefinition = {
            isDarkMode: this.theme === "dark"
        };
        
        Object.values(ThemeInternalCSSVariables).forEach(cssVariable => {
            const propValue = getComputedStyle(this).getPropertyValue(cssVariable);
            if (propValue) {
                theme[cssVariable] = propValue;
            }           
        });

        return theme;
    }

    protected getLocalizedString(string: ILocalizedString | string) {

        if (isObjectLike(string)) {
            
            const localizedValue = string[LocalizationHelper.strings?.language as string];
            
            if (!localizedValue) {
                const defaultLabel = (string as ILocalizedString).default;
                return defaultLabel ? defaultLabel : "{{Translation not found}}";
            }

            return localizedValue;
        }

        return string;
    }

    private setFASTColors() {
      
        const theme = this.getTheme();

        if (theme.isDarkMode) {
            const primaryBackgroundColor = getComputedStyle(this).getPropertyValue(ThemeInternalCSSVariables.primaryBackgroundColorDark);
            const textColorDark = getComputedStyle(this).getPropertyValue(ThemeInternalCSSVariables.textColorDark);

            baseLayerLuminance.setValueFor(this,StandardLuminance.DarkMode);
            neutralFillRest.setValueFor(this, SwatchRGB.from(parseColorHexRGB(primaryBackgroundColor) ? parseColorHexRGB(primaryBackgroundColor) : parseColorHexRGB(ThemeDefaultCSSVariablesValues.primaryBackgroundColorDark)));
            neutralFillStealthRest.setValueFor(this, neutralFillRest);
            neutralFillInputRest.setValueFor(this, neutralFillRest);
            neutralForegroundRest.setValueFor(this, SwatchRGB.from(parseColorHexRGB(textColorDark) ? parseColorHexRGB(textColorDark) : parseColorHexRGB(ThemeDefaultCSSVariablesValues.textColorDark)));
            neutralFillStealthRestFluent.setValueFor(this, neutralFillRest);
        } else {

            const textColor = getComputedStyle(this).getPropertyValue(ThemeInternalCSSVariables.textColor);

            baseLayerLuminance.setValueFor(this, StandardLuminance.LightMode);
            neutralFillRest.setValueFor(this, fillColor);
            neutralFillInputRest.setValueFor(this, neutralFillRest);
            neutralFillStealthRest.setValueFor(this, fillColor);
            neutralFillStealthRestFluent.setValueFor(this, fillColor);
            neutralForegroundRest.setValueFor(this, SwatchRGB.from(parseColorHexRGB(textColor) ? parseColorHexRGB(textColor) : parseColorHexRGB(ThemeDefaultCSSVariablesValues.defaultTextColor)));
        }

        const primaryColor = getComputedStyle(this).getPropertyValue(ThemeInternalCSSVariables.colorPrimary);
        const defaultPrimaryColor: string = !isEmpty(primaryColor) ? primaryColor : ThemeDefaultCSSVariablesValues.defaultColorPrimary.toString();
        
        if (parseColorHexRGB(defaultPrimaryColor)) {
            accentFillRest.setValueFor(this, SwatchRGB.from(parseColorHexRGB(defaultPrimaryColor)));
            accentFillHover.setValueFor(this, SwatchRGB.from(parseColorHexRGB(defaultPrimaryColor)));
            accentForegroundRest.setValueFor(this, SwatchRGB.from(parseColorHexRGB(defaultPrimaryColor)));
            accentFillActive.setValueFor(this, SwatchRGB.from(parseColorHexRGB(defaultPrimaryColor)));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected hasPropertyUpdated(changedProperties: PropertyValueMap<any>, propertyName: string) {
        return changedProperties.has(propertyName) && changedProperties.get(propertyName) !== undefined && !isEqual(changedProperties.get(propertyName), this[propertyName]); 
    }

    /**
    * Override of default method to support 'composed' flag
    *
    * @protected
    * @param {string} eventName
    * @param {*} [detail]
    * @param {boolean} [bubbles=false]
    * @param {boolean} [cancelable=false]
    * @param {boolean} [composed=false]
    * @return {*}  {boolean}
    */
    override fireCustomEvent(
        eventName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        detail?: any,
        bubbles = false,
        cancelable = false,
        composed = false
    ): boolean {
        const event = new CustomEvent(eventName, {
            bubbles,
            cancelable,
            composed,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            detail
        });
        return this.dispatchEvent(event);
    }

    /**
     * Allows a promise to be timeout 
     * https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
     * @param promise the promise to timeout
     * @param timeout the timeout delay
     * @param exception the exception raised if any error occures 
     * @returns 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private timeoutPromise(promise: Promise<unknown>, timeout: number, exception: unknown): Promise<any> {

        let timer;
        return Promise.race([
            promise,
            new Promise((_r, rej) => timer = setTimeout(rej, timeout, exception))
        ]).finally(() => clearTimeout(timer));
    }

    /**
     * Waits for a component to be present on the page and initialized to perform event binding
     * @param binding the binding detail
     * @returns 
     */
    private async waitForElement(binding: IComponentBinding, timeout?: number): Promise<void> {

        const timeoutError = Symbol();
        const timeoutValue = timeout ? timeout : 5000;

        try {

            const componentElement = await this.timeoutPromise(
                new Promise((resolve) => {

                    const element: BaseComponent = document.querySelector(`[id='${binding.id}']`);
                
                    if (element && element.isInitialized) {
                        resolve(element);
                        return;
                    }

                    const observer = new MutationObserver(() => {

                        const element: BaseComponent= document.querySelector(`[id='${binding.id}']`);
                
                        if (element && element.isInitialized) {
                            observer.disconnect();
                            resolve(element);
                            return;
                        }
                    });
            
                    observer.observe(
                        document.documentElement, {attributes: true, childList: true, subtree: true }
                    );
                }), 
                timeoutValue
                , 
                timeoutError
            );

            const eventKey = `${binding.id}-${binding.eventName}`;
            this.componentError = null;
            
            if (!this._eventHanlders.get(eventKey)) {  

                this._eventHanlders.set(eventKey, {
                    component: componentElement, 
                    event: binding.eventName, 
                    handler: binding.callbackFunction 
                });

                console.info(`Binding ${binding.id} to ${this.id}`);
                componentElement.addEventListener(binding.eventName, binding.callbackFunction);
            }

            return;

        } catch (error) {

            if (error === timeoutError) {
                const message = (`Timeout error: component with ID ${binding.id} was not found within ${timeoutValue}ms on the page"`);
                
                this.componentError = new Error(message, {
                    cause: ErrorTypes.BindingTimeoutError
                });

                console.error(message);      
            } else {
                // Other error
                console.error(error);

                this.componentError = new Error(error, {
                    cause: ErrorTypes.GeneralError
                });
            }

            return;
        }
    }
}