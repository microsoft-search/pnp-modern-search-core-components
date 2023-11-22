import { assert, elementUpdated, fixture, html } from "@open-wc/testing";
import { SearchSortComponent } from "../SearchSortComponent";
import { sortFieldsConfiguration } from "./mocks";
import sinon from "sinon";
import { ISortFieldConfiguration, SortFieldDirection } from "../../../../../models/common/ISortFieldConfiguration";
import { cloneDeep } from "lodash-es";
import { LocalizationHelper } from "@microsoft/mgt-element";
import { strings as stringsFr } from "../../../../../loc/strings.fr-fr";

import "../../../../../exports/define/pnp-search-sort";

//#region Selectors
const getSelectedFieldName = (component: SearchSortComponent) => component?.shadowRoot?.querySelector<HTMLElement>("fast-select")?.querySelector("[data-ref='current-value']");
const getSortFieldOption = (component: SearchSortComponent, fieldName: string) => component?.shadowRoot?.querySelector<HTMLInputElement>(`fast-option[data-ref='${fieldName}']`);
const getAllSortFieldOptions = (component: SearchSortComponent) => component?.shadowRoot?.querySelectorAll<HTMLElement>("fast-option");
const getSortFieldDirectionBtn = (component: SearchSortComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[data-ref='sortdirection']");
//#endregion

describe("pnp-search-sort", () => {

    describe("common", () => {

        //#region Spies
        const onSort = sinon.spy();
        //#endregion

        //#region Mocks
        let sortProperties: ISortFieldConfiguration[] = [];
        //#endregion

        beforeEach(() => {
            sortProperties = cloneDeep(sortFieldsConfiguration);
        });

        it("should be defined", () => {
            const el = document.createElement("pnp-search-sort");
            assert.instanceOf(el, SearchSortComponent);
        });

        it ("should display available sort fields according to configuration", async () => {

            const el: SearchSortComponent = await fixture(
                html`
                  <pnp-search-sort 
                    .sortProperties=${sortProperties}
                    .onSort=${onSort}
                  >
                  </pnp-search-sort>
            `);

            assert.equal(getAllSortFieldOptions(el)?.length, 3);
            assert.exists(getSortFieldOption(el, "Relevance"));
            assert.exists(getSortFieldOption(el, "Created"));
            assert.exists(getSortFieldOption(el, "LastModifiedTime"));
        });

        it ("should display sort by relevance if no default field is specifed in configuration", async () => {

            onSort.resetHistory();

            const el: SearchSortComponent = await fixture(
                html`
                  <pnp-search-sort 
                    .sortProperties=${sortProperties.map(s => { s.isDefaultSort = false; return s;})}
                    .onSort=${onSort}
                  >
                  </pnp-search-sort>
            `);

            assert.equal(getSelectedFieldName(el)?.textContent, "Sorted by relevance");
            assert.equal(el.selectedFieldName, null);
            assert.equal(el.selectedSortDirection, SortFieldDirection.Descending);

            // Shouldn't be able to change direction
            getSortFieldDirectionBtn(el)?.click();
           el.requestUpdate();
            await elementUpdated(el);

            assert.equal(onSort.callCount, 0);

        });

        it ("should select default sort field if specified in configuration", async () => {

            onSort.resetHistory();
            const el: SearchSortComponent = await fixture(
                html`
                  <pnp-search-sort 
                    .sortProperties=${sortProperties}
                    .onSort=${onSort}
                  >
                  </pnp-search-sort>
            `);

            assert.exists(getSelectedFieldName(el), "Created");
            assert.equal(el.selectedFieldName, "Created");
            assert.equal(el.selectedSortDirection, SortFieldDirection.Ascending);
            assert.equal(onSort.callCount, 0); // Initial sort should occur in the connected search results component
        });

        it ("should reset sort when default selected", async () => {

            onSort.resetHistory();
            
            const el: SearchSortComponent = await fixture(
                html`
                  <pnp-search-sort 
                    .sortProperties=${sortProperties}
                    .onSort=${onSort}
                  >
                  </pnp-search-sort>
            `);

            getSortFieldOption(el, "Relevance")?.click();
           el.requestUpdate();
            await elementUpdated(el);

            assert.isEmpty(onSort.getCall(0).args[0]); // Should be an empty array
            assert.equal(el.selectedFieldName, null);
            assert.equal(el.selectedSortDirection, SortFieldDirection.Ascending); // Should keep the initial direction
        });

        it ("should sort by select field and direction", async () => {

            onSort.resetHistory();
            const el: SearchSortComponent = await fixture(
                html`
                  <pnp-search-sort 
                    .sortProperties=${sortProperties}
                    .onSort=${onSort}
                  >
                  </pnp-search-sort>
            `);

            getSortFieldOption(el, "LastModifiedTime")?.click();

           el.requestUpdate();
            await elementUpdated(el);

            assert.equal(onSort.callCount, 1);
            assert.deepEqual(onSort.getCall(0).args[0], [{
                isDescending: false,
                name: "LastModifiedTime"
            }]);
            assert.equal(el.selectedFieldName, "LastModifiedTime");
            assert.equal(el.selectedSortDirection, SortFieldDirection.Ascending); // Default direction in mock data

            // Change direction
            getSortFieldDirectionBtn(el)?.click();
           el.requestUpdate();
            await elementUpdated(el);

            assert.equal(onSort.callCount, 2);
            assert.deepEqual(onSort.getCall(1).args[0],  [{
                isDescending: true, 
                name: "LastModifiedTime"
            }]);
            assert.equal(el.selectedFieldName, "LastModifiedTime");
            assert.equal(el.selectedSortDirection, SortFieldDirection.Descending);
        });

        it ("should handle localization for sort field names", async () => {

            const el: SearchSortComponent = await fixture(
                html`
                  <pnp-search-sort 
                    .sortProperties=${sortProperties}
                    .onSort=${onSort}
                  >
                  </pnp-search-sort>
            `);

            LocalizationHelper.strings = stringsFr;
            el.requestUpdate();
            await elementUpdated(el);

            assert.exists(getSortFieldOption(el, "Pertinence"));
            assert.equal(getSortFieldOption(el, "Created")?.getAttribute("data-ref-label"), "Date de création");
            assert.equal(getSortFieldOption(el, "LastModifiedTime")?.getAttribute("data-ref-label"), "Date de modification");
        });
    });
});