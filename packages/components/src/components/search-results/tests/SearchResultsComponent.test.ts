import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { assert, elementUpdated, expect, html } from "@open-wc/testing";
import { fixture, oneEvent } from "@open-wc/testing-helpers";
import sinon from "sinon";
import { EventConstants, ThemeDefaultCSSVariablesValues } from "../../../common/Constants";
import { SearchResultsComponent } from "../SearchResultsComponent";
import { mockResults } from "./mocks";

import "../../../exports/define/pnp-search-results";
import "../../../exports/define/pnp-adaptive-card";
import { TestsHelper } from "../../../helpers/TestsHelper";


//#region Selectors
const getDefaultResultsItems = (component: SearchResultsComponent) => component?.shadowRoot?.querySelectorAll<HTMLElement>("[data-ref='item']");
const getTemplateResultsItems = (component: SearchResultsComponent) => component.querySelectorAll<HTMLElement>("[data-ref='item']");
const getTemplateShimmers = (component: SearchResultsComponent) => component.querySelectorAll<HTMLElement>("[data-ref='shimmer']");
const getTemplateShimmersSlot = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector("slot[name='shimmers']");
const getSeeAllLink = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector<HTMLLinkElement>("a[data-ref='see-all-link']");
const getComponentTitle = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[data-ref='component-title']");
const getShowCount = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[data-ref='show-count']");
const getDebugBarBtn = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[data-ref='debug-mode-bar-button']");
const getMonacoEditor = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector<HTMLElement>("pnp-monaco-editor");
const getRootDarkModeClass = (component: SearchResultsComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[class='dark']");
const getInnerDarkModeClass = (component: SearchResultsComponent): Element => component?.shadowRoot?.querySelector<Element>("[class='dark:bg-primaryBackgroundColorDark']") as Element;
//#endregion

//#region Utility methods
const rgbToHex = (rgba, forceRemoveAlpha = false) => {
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts them to numbers
      .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
      .join(""); // Puts the array to togehter to a string
};
  
//#endregion

//#region Stubs
const stubSearchResults = async (el: SearchResultsComponent) => {

    const listener = oneEvent(el, EventConstants.SEARCH_RESULTS_EVENT);

    const stub = sinon.stub(el.msSearchService, "search");
    stub.returns(Promise.resolve(mockResults));

    el.requestUpdate();
    await elementUpdated(el);

    assert.equal(stub.callCount, 0);
    assert.equal(el.data.items.length, 0);

    // Simulates a login to trigger the `loadState()` method
    await Providers?.globalProvider?.login();

    el.requestUpdate();
    await elementUpdated(el);

    // Search is called only once ensuring no unwanted updates are performed during refresh lifecycle
    assert.equal(stub.callCount, 1);
    assert.equal(el.data.items.length, 5);
    assert.equal(el.data.totalCount, 5);

    // Ensure we get the correct event sent
    const event = await listener;
    expect(event).to.exist;

    el.requestUpdate();
    await elementUpdated(el);

    return stub;
};
//#endregion

describe("pnp-search-results", () => {

    beforeEach(() => {
        Providers.globalProvider = TestsHelper.getTestProvider();
    });
    
    afterEach(async () => {
        await Providers?.globalProvider?.logout();
    });

    describe("common", async () => {

        it("should be defined", () => {
            const el = document.createElement("pnp-search-results");
            assert.instanceOf(el, SearchResultsComponent);
        });

        it("should retrieve and show items with default template", async () => {

            const el: SearchResultsComponent = await fixture(html`<pnp-search-results .defaultQueryText=${"*"}></pnp-search-results>`);
            await stubSearchResults(el);

            // Items should be displayed using the default template
            assert.equal(getDefaultResultsItems(el)?.length, 5);
        });
    });

    describe("theming", async () => {

        it("should support dark mode by setting the CSS 'dark' class explicitly", async () => {

            const el: SearchResultsComponent = await fixture(
                html`
                    <pnp-search-results 
                        .defaultQueryText=${"*"}
                        class="dark"
                    >
                    </pnp-search-results>
                `);

            await stubSearchResults(el);

            assert.isNotNull(getRootDarkModeClass(el));
      
            // Default color should be set
            const rbgColor: string = window.getComputedStyle(getInnerDarkModeClass(el)).backgroundColor;
            assert.equal(rgbToHex(rbgColor),ThemeDefaultCSSVariablesValues.primaryBackgroundColorDark);
            
        });

        it("should support dark mode by using a top CSS class named 'dark'", async () => {

            //https://tailwindcss.com/docs/dark-mode
            const content: HTMLElement = await fixture(
                html`
                    <div class="dark">
                        <pnp-search-results 
                            .defaultQueryText=${"*"}
                        >
                        </pnp-search-results>
                    </div>
                `);

            const el = content.querySelector("pnp-search-results") as SearchResultsComponent;

            await stubSearchResults(el);

            el.requestUpdate();
            await elementUpdated(el);

            assert.isNotNull(getRootDarkModeClass(el));

            // Default color should be set
            const rbgColor: string = window.getComputedStyle(getInnerDarkModeClass(el)).backgroundColor;
            assert.equal(rgbToHex(rbgColor),ThemeDefaultCSSVariablesValues.primaryBackgroundColorDark);

            return;
         
        });

        it("should support settings custom values via CSS variables", async () => {

            const content: SearchResultsComponent = await fixture(
                html`
                    <div class="dark">
                        <pnp-search-results 
                            .defaultQueryText=${"*"}
                        >
                        </pnp-search-results>
                    </div>
                `);
            
            const el = content.querySelector("pnp-search-results") as SearchResultsComponent;

            await stubSearchResults(el);
            el.requestUpdate();
            await elementUpdated(el);

            el.style.setProperty("--pnpsearch-colorBackgroundDarkPrimary","#000");

            assert.isNotNull(getRootDarkModeClass(el));

            // Default color should be set
            const rbgColor: string = window.getComputedStyle(getInnerDarkModeClass(el)).backgroundColor;
            assert.equal(rgbToHex(rbgColor),"#000000");
        });
    });

    describe("styling", async () => {

        it("should display title, count and/or 'see all' link when specified", async () => {
            
            const el: SearchResultsComponent = await fixture(html`<pnp-search-results .defaultQueryText=${"*"}></pnp-search-results>`);
            await stubSearchResults(el);

            assert.isNull(getSeeAllLink(el));
            el.seeAllLink = "http://fakesite.com";
            el.requestUpdate();
            await elementUpdated(el);
            assert.isNotNull(getSeeAllLink(el));
            assert.equal(getSeeAllLink(el)?.href, "http://fakesite.com/");
            assert.include(getSeeAllLink(el)?.innerText, "See all");

            assert.isNull(getComponentTitle(el));
            el.componentTitle = "MyTitle";
           el.requestUpdate();
            await elementUpdated(el);
            assert.isNotNull(getComponentTitle(el));
            assert.equal(getComponentTitle(el)?.innerText, "MyTitle");

            assert.isNull(getShowCount(el));
            el.showCount = true;
            el.requestUpdate();
            await elementUpdated(el);
            assert.isNotNull(getShowCount(el));
            assert.include(getShowCount(el)?.innerText, "5");

        });

        it("should render custom template for items if provided", async () => {

            const el: SearchResultsComponent = await fixture(html`
                <pnp-search-results .defaultQueryText=${"*"}>
                    <template data-type="items">
                        <ul>
                            <li data-for='item in items' data-ref="item">
                                <a href="{{item.resource.fields.defaultEncodingURL}}">
                                    <span class="font-bold">{{item.resource.fields.title}}</span>
                                </a>
                            </li>
                        </ul>
                    </template>
                </pnp-search-results>
            `);

            await stubSearchResults(el);

            assert.equal(getTemplateResultsItems(el).length, 5);
        });

        it("should render custom template for shimmers if provided", async () => {

            const pageSize = 8;
            const el: SearchResultsComponent = await fixture(html`
                <pnp-search-results 
                    .defaultQueryText=${"*"}
                    .pageSize=${pageSize}                
                >
                    <template data-type="shimmers">
                        <ul>
                            <li data-for='i in items' data-ref="shimmer">
                                <div class="flex space-x-2 mb-2 ">
                                    <div class="w-6 h-6 rounded bg-slate-200"></div>
                                    <div class="w-96 h-6 rounded bg-slate-200"></div>
                                </div>
                            </li>
                        </ul>
                    </template>
                </pnp-search-results>
            `);

            assert.isNotNull(getTemplateShimmersSlot(el));
            // Number of shimmers are determined according to the page size parameter
            assert.equal(getTemplateShimmers(el).length, pageSize);
           
            await stubSearchResults(el);
        
            // Shimmers should disappear when data is displayed
            assert.isNull(getTemplateShimmersSlot(el));
           
        });

        it ("should show debug mode bar when debug mode is enabled", async () => {

            const el: SearchResultsComponent = await fixture(html`
                <pnp-search-results 
                    .defaultQueryText=${"*"}
                    .enableDebugMode=${true}           
                >
                </pnp-search-results>
            `);

            await stubSearchResults(el);          

            assert.isNotNull(getDebugBarBtn(el));
            getDebugBarBtn(el)?.click();

           el.requestUpdate();
            await elementUpdated(el);

            assert.isNotNull(getMonacoEditor(el));
        });

        it("should convert raw text from data into html using data-html attribute", async () => {

            const el: SearchResultsComponent = await fixture(html`
                <pnp-search-results .defaultQueryText=${"*"}>
                    <template data-type="items">
                        <span id="text" class="font-bold">{{ rawHtml }}</span>
                        <span id="html" data-html class="font-bold">{{ rawHtml }}</span>
                    </template>
                </pnp-search-results>
            `);

            await stubSearchResults(el);

            el.templateContext = {
                ...el.templateContext,
                rawHtml: "<strong>raw text</strong>"
            };

            el.requestUpdate();
            await elementUpdated(el);

            assert.equal(el?.querySelector<HTMLElement>("[id='text']")?.innerText, "<strong>raw text</strong>");
            assert.equal(el?.querySelector<HTMLElement>("[id='html']")?.innerText, "raw text");
        });

        it("should allow usage of MGT components in templates", async () => {

            const el: SearchResultsComponent = await fixture(html`
                <pnp-search-results .defaultQueryText=${"*"}>
                    <template data-type="items">
                        <mgt-file-list></mgt-file-list>
                    </template>
                </pnp-search-results>
            `);

            const listener = oneEvent(el, EventConstants.SEARCH_MGT_COMPONENTS_LOADED);

            await stubSearchResults(el);

            assert.isUndefined(customElements.get("mgt-file-list"));
            el.useMicrosoftGraphToolkit = true;

            await listener;

            assert.isDefined(customElements.get("mgt-file-list"));

        });
    });
});