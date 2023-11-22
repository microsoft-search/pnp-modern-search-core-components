import { fixture, assert, html } from "@open-wc/testing";

// Needed to define child components
import "../exports/define/pnp-search-input";
import "../exports/define/pnp-search-results";
import "../exports/define/pnp-search-filters";
import "../exports/define/pnp-checkbox-filter";
import "../exports/define/pnp-search-verticals";
import { SearchFiltersComponent } from "./search-filters/SearchFiltersComponent";
import { SearchResultsComponent } from "./search-results/SearchResultsComponent";
import { SearchVerticalsComponent } from "./search-verticals/SearchVerticalsComponent";
import { SearchInputComponent } from "./search-input/SearchInputComponent";
import { baseFilterConfiguration, basefilterResults } from "./search-filters/tests/mocks";
import { baseVerticalSettings } from "./search-verticals/tests/mocks";
import { ErrorTypes } from "../common/Constants";

const getSearchBoxComponent = (): Promise<SearchInputComponent> => {
    return fixture(html` <pnp-search-input id="edfdea93-23c9-4ba6-94d9-a848a1384104"></pnp-search-input>`);
};

const getSearchFiltersComponent= (): Promise<SearchFiltersComponent> => {
    return fixture(
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
};

const getSearchVerticalsComponent = (): Promise<SearchVerticalsComponent> => {
    return fixture(html` <pnp-search-verticals id="0fa619a7-442a-4255-8fca-f3ce36a01518" .verticals=${baseVerticalSettings}></pnp-search-verticals>`); 
};

const getSearchResultsComponent = (): Promise<SearchResultsComponent> => {
    return fixture(html`<pnp-search-results 
                            id="b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"
                            .searchInputComponentId=${"edfdea93-23c9-4ba6-94d9-a848a1384104"}
                        >
                        </pnp-search-results>`);
};

const getSearchResultsComponentWithFiltersAndVerticals = (): Promise<SearchResultsComponent> => {
    return fixture(html`<pnp-search-results
                            id="b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"
                            .selectedVerticalKeys=${["tab1"]}
                            .searchFiltersComponentId=${"99d3e914-2c8e-4f42-897e-53bb4d960e94"}
                            .searchVerticalsComponentId=${"0fa619a7-442a-4255-8fca-f3ce36a01518"}
                            .searchInputComponentId=${"edfdea93-23c9-4ba6-94d9-a848a1384104"}
                        >
                        </pnp-search-results>`);
};

describe("common", () => {

    it("should initialzed after connected callback",async () => {

        const searchInputComponent = await getSearchBoxComponent();
        const searchFiltersComponent = await getSearchFiltersComponent();
        const searchResultsComponent = await getSearchResultsComponent();
        const searchVerticalsComponent = await getSearchVerticalsComponent();

        assert.equal(searchInputComponent.isInitialized, true);
        assert.equal(searchFiltersComponent.isInitialized, true);
        assert.equal(searchResultsComponent.isInitialized, true);
        assert.equal(searchVerticalsComponent.isInitialized, true);
    });
    
    it("should connect without delay to other components if available at page load", async () => {

        await getSearchBoxComponent();
        const searchResultsComponent = await getSearchResultsComponent();
 
        assert.isNull(searchResultsComponent.componentError);
        assert.equal(searchResultsComponent._eventHanlders.size, 1);
        assert.isNotNull(searchResultsComponent._eventHanlders.get("edfdea93-23c9-4ba6-94d9-a848a1384104-PnPModernSearchCoreComponents:Search:Input"));
    });

    it("should wait for other component if not available at page load", async () => {

        getSearchResultsComponent().then((searchResultsComponent) => {

            assert.isNull(searchResultsComponent.componentError);
            assert.equal(searchResultsComponent._eventHanlders.size, 1);
            assert.isNotNull(searchResultsComponent._eventHanlders.get("edfdea93-23c9-4ba6-94d9-a848a1384104-PnPModernSearchCoreComponents:Search:Input"));
        });

        await new Promise<SearchInputComponent>((resolve) =>
            setTimeout(() => resolve(getSearchBoxComponent()), 2000)
        );
    });

    it("should stop wait and stop after a timeout if connected components are not found", (done) => {
        
        getSearchResultsComponent().then((searchResultsComponent) => {
            assert.equal(searchResultsComponent.componentError?.cause, ErrorTypes.BindingTimeoutError );
            assert.equal(searchResultsComponent._eventHanlders.size, 0);
        }).catch((err) => {
            done(err);
        });

        // Delay should be longer than default waiting time for a binding (10s)
        new Promise<SearchInputComponent>((resolve) =>
            setTimeout(() => resolve(getSearchBoxComponent()), 12000)
        ).then(() => done());
    });

    it("should handle multiple bindings on multiple components not immediatly available on the page", (done) => {
       
        getSearchResultsComponentWithFiltersAndVerticals().then((searchResultsComponent) => {

            assert.isNull(searchResultsComponent.componentError);
            assert.equal(searchResultsComponent._eventHanlders.size, 3);

            // Search input
            assert.isNotNull(searchResultsComponent._eventHanlders.get("edfdea93-23c9-4ba6-94d9-a848a1384104-PnPModernSearchCoreComponents:Search:Input"));
        
            // Search verticals
            assert.isNotNull(searchResultsComponent._eventHanlders.get("0fa619a7-442a-4255-8fca-f3ce36a01518-PnPModernSearchCoreComponents:Search:Verticals"));
            
            // Search filters
            assert.isNotNull(searchResultsComponent._eventHanlders.get("99d3e914-2c8e-4f42-897e-53bb4d960e94-PnPModernSearchCoreComponents:Search:Filter"));
        
        }).catch((err) => {
            done(err);
        });

        getSearchFiltersComponent().then((searchFiltersComponent) => {
           
            assert.isNull(searchFiltersComponent.componentError);
            assert.equal(searchFiltersComponent._eventHanlders.size, 2);

            // Search results
            assert.isNotNull(searchFiltersComponent._eventHanlders.get("b359f3dc-6b6a-4575-90ed-e5942bcbb8a6-PnPModernSearchCoreComponents:Search:Results"));

            // Search verticals
            assert.isNotNull(searchFiltersComponent._eventHanlders.get("0fa619a7-442a-4255-8fca-f3ce36a01518-PnPModernSearchCoreComponents:Search:Verticals"));
        
        }).catch((err) => {
            done(err);
        });

        Promise.all([
            new Promise<SearchInputComponent>((resolve) =>
                setTimeout(() => resolve(getSearchBoxComponent()), 2000)
            ),
            new Promise<SearchFiltersComponent>((resolve) =>
                setTimeout(() => resolve(getSearchFiltersComponent()), 2000)
            ),
            new Promise<SearchVerticalsComponent>((resolve) =>
                setTimeout(() => resolve(getSearchVerticalsComponent()), 3000)
            )
        ]).then(() => {
            done();
        });       
    });
});