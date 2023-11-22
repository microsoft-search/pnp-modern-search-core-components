import { SearchFiltersComponent } from "../SearchFiltersComponent";
import { fixture, assert, html, elementUpdated, oneEvent } from "@open-wc/testing";
import { ISearchResultsEventData } from "../../../models/events/ISearchResultsEventData";
import { EventConstants } from "../../../common/Constants";
import { baseFilterConfiguration, basefilterResults } from "./mocks";
import { ISearchFiltersEventData } from "../../../models/events/ISearchFiltersEventData.ts";
import { CheckboxFilterComponent } from "../sub-components/filters/checkbox-filter/CheckboxFilterComponent";
import { SearchVerticalsComponent } from "../../search-verticals/SearchVerticalsComponent";
import { baseVerticalSettings } from "../../search-verticals/tests/mocks";

// Needed to define child components
import "../../../exports/define/pnp-search-results";
import "../../../exports/define/pnp-search-filters";
import "../../../exports/define/pnp-checkbox-filter";
import "../../../exports/define/pnp-search-verticals";
import { SearchResultsComponent } from "../../search-results/SearchResultsComponent";


//#region Selectors
const getResetButton = (component: SearchFiltersComponent) => component?.shadowRoot?.querySelector<HTMLButtonElement>("button[data-ref='reset'");
const getFilterItem = (component: SearchFiltersComponent, componentName: string, filterName: string) => component?.shadowRoot?.querySelector<HTMLElement>(`${componentName}[data-ref-name='${filterName}']`);
const getFilterItemShimmer = (component: SearchFiltersComponent, filterName: string) => component?.shadowRoot?.querySelector<HTMLElement>(`[data-ref='shimmer'][data-ref-name='${filterName}']`);
const getFilterItemValueByName = (component: SearchFiltersComponent, componentName: string, filterName: string, valueName: string) => component?.shadowRoot?.querySelector<HTMLElement>(`${componentName}[data-ref-name='${filterName}']`)?.shadowRoot?.querySelector<HTMLElement>(`fast-menu-item[data-ref-name='${valueName}']`);
const getCheckboxFilters = (component: SearchFiltersComponent) => component?.shadowRoot?.querySelectorAll<CheckboxFilterComponent>("pnp-filter-checkbox");
const getDebugBarBtn = (component: SearchFiltersComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[data-ref='debug-mode-bar-button']");
const getMonacoEditor = (component: SearchFiltersComponent) => component?.shadowRoot?.querySelector<HTMLElement>("pnp-monaco-editor");
//#endregion

describe("pnp-search-filters", () => {

  it("should be defined", () => {
    const el = document.createElement("pnp-search-filters");
    assert.instanceOf(el, SearchFiltersComponent);
  });

  it("should select and reset selected values", async () => {

    const el: SearchFiltersComponent = await fixture(
      html`
        <pnp-search-filters 
          id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
          .filterConfiguration=${baseFilterConfiguration}
          .availableFilters=${basefilterResults}
          .submittedQueryText=${"*"}
        >
        </pnp-search-filters>
    `);

    assert.isNull(getResetButton(el));

    // Select multiple values from filters
    getFilterItemValueByName(el, "pnp-filter-checkbox","FileType","docx")?.click();

    // Catch only the second event to get the accurate count for submitted filters 
    // Because filters are not mutli value is sent right after click
    let listener = oneEvent(el, EventConstants.SEARCH_FILTER_EVENT);

    getFilterItemValueByName(el,"pnp-filter-checkbox","ModifiedBy","User 1")?.click();

    assert.equal(el.allSelectedFilters.length, 2);
    assert.equal(el.allSubmittedFilters.length, 2);

    // Ensure we get the correct event with selected filters
    let event = await listener;
    let eventData = (event.detail as ISearchFiltersEventData);
    assert.equal(eventData.selectedFilters.length, 2);
    const docxFilter = eventData.selectedFilters.filter(f => f.filterName === "FileType")[0];
    const userFilter = eventData.selectedFilters.filter(f => f.filterName === "ModifiedBy")[0];

    assert.isNotNull(docxFilter);
    assert.equal(docxFilter.values.length, 1);
    assert.equal(docxFilter.values.filter(v => v.name === "docx").length, 1);

    assert.isNotNull(userFilter);
    assert.equal(userFilter.values.length, 1);
    assert.equal(userFilter.values.filter(v => v.name === "User 1").length, 1);

    assert.isNotNull(getResetButton(el));

    listener = oneEvent(el, EventConstants.SEARCH_FILTER_EVENT);

    // Reset all values
    getResetButton(el)?.click();
    
    assert.equal(el.allSelectedFilters.length, 0);
    assert.equal(el.allSubmittedFilters.length, 0);

    event = await listener;
    eventData = (event.detail as ISearchFiltersEventData);

    assert.equal(eventData.selectedFilters.length, 0);
  });
 
  it("should render filters from connected search results", async () => {

    const localSearchResultsComponent: SearchResultsComponent = await fixture(html`<pnp-search-results id="b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"></pnp-search-results>`);
    const localSearchFiltersComponent: SearchFiltersComponent = await fixture(
      html`
          <pnp-search-filters 
            id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
            .searchResultsComponentIds=${["b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"]}
            .filterConfiguration=${baseFilterConfiguration}
            .availableFilters=${[]}
          >
          </pnp-search-filters>
    `);

    assert.equal(getCheckboxFilters(localSearchFiltersComponent)?.length, 0);
      
    setTimeout(() => {
      // Simulate new results
      localSearchResultsComponent.dispatchEvent(new CustomEvent<ISearchResultsEventData>(EventConstants.SEARCH_RESULTS_EVENT, {
        detail: {
          availableFilters: basefilterResults,
          resultsCount: 175, // Not used in filters
          submittedQueryText: "*" // Not used in filters
        }
     }));
    });

    await oneEvent(localSearchResultsComponent, EventConstants.SEARCH_RESULTS_EVENT);
    await elementUpdated(localSearchFiltersComponent);

    assert.equal(getCheckboxFilters(localSearchFiltersComponent)?.length, 2);
  });

  it("should display/hide filters according to selected vertical", async () => {

    const verticalComponent: SearchVerticalsComponent = await fixture(html` <pnp-search-verticals id="0fa619a7-442a-4255-8fca-f3ce36a01518" .verticals=${baseVerticalSettings}></pnp-search-verticals>`);
    // Need to be declared before filters so filters can bind correctly
    const searchResultsComponent: SearchResultsComponent = await fixture(html`<pnp-search-results id="b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"></pnp-search-results>`);

    const filterComponent: SearchFiltersComponent = await fixture(
      html`
          <pnp-search-filters 
            id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
            .filterConfiguration=${baseFilterConfiguration}
            .availableFilters=${basefilterResults}
            .searchVerticalsComponentId=${"0fa619a7-442a-4255-8fca-f3ce36a01518"}
            .submittedQueryText=${"*"}
            .searchResultsComponentIds=${["b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"]}
          >
          </pnp-search-filters>
    `);

    assert.isNotNull(getFilterItem(filterComponent,"pnp-filter-checkbox","FileType"));
    assert.isNull(getFilterItem(filterComponent,"pnp-filter-checkbox","ModifiedBy"));
    verticalComponent.selectVertical("tab2");

    verticalComponent.requestUpdate();
    await elementUpdated(verticalComponent);

    // Should display shimmer until new results are available
    assert.isNotNull(getFilterItemShimmer(filterComponent,"ModifiedBy"));
    assert.isNull(getFilterItem(filterComponent,"pnp-filter-checkbox","FileType"));
    assert.isNull(getFilterItem(filterComponent,"pnp-filter-checkbox","ModifiedBy"));

    // Simulate new results
    setTimeout(() => {
      searchResultsComponent.dispatchEvent(new CustomEvent<ISearchResultsEventData>(EventConstants.SEARCH_RESULTS_EVENT, {
        detail: {
          availableFilters: basefilterResults,
          resultsCount: 175, // Not used in filters
          submittedQueryText: "*" // Not used in filters
        }
     }));
    });

    await oneEvent(searchResultsComponent, EventConstants.SEARCH_RESULTS_EVENT);
    await elementUpdated(filterComponent);

    assert.isNull(getFilterItem(filterComponent,"pnp-filter-checkbox","FileType"));
    assert.isNotNull(getFilterItem(filterComponent,"pnp-filter-checkbox","ModifiedBy"));

  });

  it ("should show debug mode bar when debug mode is enabled", async () => {

    const el: SearchFiltersComponent = await fixture(html`
        <pnp-search-filters 
          id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
          .filterConfiguration=${baseFilterConfiguration}
          .availableFilters=${basefilterResults}
          .submittedQueryText=${"*"}
          .enableDebugMode=${true}           
        >
        </pnp-search-filters>
    `);

    assert.isNotNull(getDebugBarBtn(el));
    getDebugBarBtn(el)?.click();

    await el.requestUpdate();
    await elementUpdated(el);

    assert.isNotNull(getMonacoEditor(el));
  });

  it ("should support 'filter-value' template", async () => {

    const el: SearchFiltersComponent = await fixture(html`
        <pnp-search-filters 
          id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
          .filterConfiguration=${baseFilterConfiguration}
          .availableFilters=${basefilterResults}
          .submittedQueryText=${"*"}
          .enableDebugMode=${true}           
        >
          <template data-type="filter-value">

            <div data-if="filterName === 'FileType'">
                <div id="testTemplate" data-highlight>{{ name.toUpperCase() }}</div>
            </div>
            <div data-else>
              {{ name }}
            </div>
          </template>

        </pnp-search-filters>
    `);

    assert.isNotNull(el?.shadowRoot?.querySelector("#testTemplate"));  
    assert.equal(el?.shadowRoot?.querySelector("#testTemplate")?.textContent, "PPTX");

  });

  it ("should support 'filter-name' template", async () => {

    const el: SearchFiltersComponent = await fixture(html`
        <pnp-search-filters 
          id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
          .filterConfiguration=${baseFilterConfiguration}
          .availableFilters=${basefilterResults}
          .submittedQueryText=${"*"}
          .enableDebugMode=${true}           
        >
          <template data-type="filter-name">
              <div data-if="name === 'FileType'">
                  <div id="testTemplate" data-highlight>{{ name.toUpperCase() }}</div>
              </div>
          </template>

        </pnp-search-filters>
    `);

    assert.isNotNull(el?.shadowRoot?.querySelector("#testTemplate"));  
    assert.equal(el?.shadowRoot?.querySelector("#testTemplate")?.textContent, "FILETYPE");

  });
});