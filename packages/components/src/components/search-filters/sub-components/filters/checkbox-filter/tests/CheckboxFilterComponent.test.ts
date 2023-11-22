/* eslint-disable lit/no-invalid-html */
/* eslint-disable lit/binding-positions */
import { LocalizationHelper } from "@microsoft/mgt-element";
import { fixture, assert, html, expect, elementUpdated, defineCE, unsafeStatic } from "@open-wc/testing";
import { CheckboxFilterComponent } from "../CheckboxFilterComponent";
import { strings as stringsFr } from "../../../../../../loc/strings.fr-fr";
import { strings as stringsEn } from "../../../../../../loc/strings.default";
import { aggregatedFilterConfiguration, aggregatedFilterResults, baseFilterConfiguration, basefilterResults } from "./mocks";
import sinon from "sinon";

//#region Spies
const onApplyFiltersSpy = sinon.spy();
//#endregion

//#region Components
const baseCheckboxFilterTagName = defineCE(CheckboxFilterComponent);
const tagBaseCheckboxFilter = unsafeStatic(baseCheckboxFilterTagName);

const baseCheckboxFilter: CheckboxFilterComponent = await fixture(
  html`
  <${tagBaseCheckboxFilter}
    .filter=${basefilterResults}
    .filterConfiguration=${baseFilterConfiguration}
    .onFilterUpdated=${() => {return;}} 
    .onApplyFilters=${onApplyFiltersSpy}
  >
  </${tagBaseCheckboxFilter}>
`);


//#endregion

//#region Selectors
const getResetButton = (component: CheckboxFilterComponent = baseCheckboxFilter) => component?.shadowRoot?.querySelector<HTMLButtonElement>("fast-button[data-ref='reset'");
const getApplyButton = (component: CheckboxFilterComponent = baseCheckboxFilter) => component?.shadowRoot?.querySelector<HTMLButtonElement>("fast-button[data-ref='apply'");
const getCancelButton = (component: CheckboxFilterComponent = baseCheckboxFilter) => component?.shadowRoot?.querySelector<HTMLButtonElement>("fast-button[data-ref='cancel'");
const getMenuItems = (component: CheckboxFilterComponent = baseCheckboxFilter) => component?.shadowRoot?.querySelectorAll<HTMLElement>("fast-menu-item");
const getFilterItemValueByName = (name: string, component: CheckboxFilterComponent = baseCheckboxFilter) => component?.shadowRoot?.querySelector<HTMLElement>(`fast-menu-item[data-ref-name='${name}']`);
const getFilterItemIconByName = (name: string, component: CheckboxFilterComponent = baseCheckboxFilter) => component?.shadowRoot?.querySelector<HTMLImageElement>(`fast-menu-item[data-ref-name='${name}'] img[data-ref='icon']`);
//#endregion

describe("pnp-checkbox-filter ", () => {

    describe("common", () => {

      beforeEach(async () => {
        LocalizationHelper.strings = stringsEn;
        baseCheckboxFilter.requestUpdate();
      });

      it("should be defined", () => {
        assert.instanceOf(baseCheckboxFilter, CheckboxFilterComponent);
      });

      it("should support localization for filter name", async () => {

        baseCheckboxFilter.filterConfiguration.displayName = {
            default: "File Type",
            "fr-fr": "Type de fichier" 
        };

        baseCheckboxFilter.requestUpdate();
        await elementUpdated(baseCheckboxFilter);

        // Check default language
        let item = baseCheckboxFilter?.shadowRoot?.querySelector("span[data-ref-name='File Type']");
        assert.isNotNull(item);

        // Load fr-fr strings
        LocalizationHelper.strings = stringsFr;
        baseCheckboxFilter.requestUpdate();
        await elementUpdated(baseCheckboxFilter);

        // Check updated language
        item = baseCheckboxFilter?.shadowRoot?.querySelector("span[data-ref-name='Type de fichier']");
        assert.isNotNull(item);
      });

      it("should support search", async () => {
    
        assert.equal(getMenuItems()?.length, 3);
    
        // Filter a value with 'doc'
        baseCheckboxFilter.filterValues("doc");
        await elementUpdated(baseCheckboxFilter);
    
        // Should only display 'docx'
        assert.equal(getMenuItems()?.length, 1);
    
        baseCheckboxFilter.filterValues("p");
        await elementUpdated(baseCheckboxFilter);
    
        // Should only display 'pdf' and 'pptx'
        assert.equal(getMenuItems()?.length, 2);

        // Reset state
        baseCheckboxFilter.filterValues("");
        baseCheckboxFilter.requestUpdate();
      });

      it("should support filter value aggregations from configuration", async () => {

        const el: CheckboxFilterComponent = await fixture(
          html`
            <${tagBaseCheckboxFilter}
              .filter=${aggregatedFilterResults}
              .filterConfiguration=${aggregatedFilterConfiguration}
              .onFilterUpdated=${() => {return;}} 
              .onApplyFilters=${onApplyFiltersSpy}
            >
            </${tagBaseCheckboxFilter}>
        `);


        const aggregatedValue = getFilterItemValueByName("Word document", el);

        // One aggregated value + 'pptx' values
        assert.equal(getMenuItems(el)?.length, 2);
        assert.isNotNull(aggregatedValue);
        assert.isNotNull(getFilterItemValueByName("pptx", el));

        // Filter value should correctly aggregated        
        assert.equal(aggregatedValue?.getAttribute("data-ref-count"), "175");
        assert.equal(aggregatedValue?.getAttribute("data-ref-value"), "or(\"docx\",\"doc\",\"docm\")");

        // Should have the "Word document aggregation in the UI
        expect(getFilterItemValueByName("Word document", el)?.innerText).to.contains("Word document");

        // Should have the correct img URL
        assert.equal(getFilterItemIconByName("Word document", el)?.src, "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/48/docx.svg");
      });

      after(async () => {
        // Reset to base configuration
        baseCheckboxFilter.filterConfiguration = baseFilterConfiguration;
        baseCheckboxFilter.filter = basefilterResults;
        baseCheckboxFilter.requestUpdate();
      });

    });

    describe("single value", async () => {

      before(async () => {
        baseCheckboxFilter.filterConfiguration.isMulti = false;
        baseCheckboxFilter.requestUpdate();
      });

      it("should support single value", async () => {
        assert.isNull(getApplyButton());
        assert.isNull(getCancelButton());
      });

      
    });

    describe("multi values", async () => {

      before(async () => {
        baseCheckboxFilter.filterConfiguration.isMulti = true;
        baseCheckboxFilter.requestUpdate();
      });

      beforeEach(async () => {
        onApplyFiltersSpy.resetHistory();
      });

      it("should support multi values", async () => {

        const el: CheckboxFilterComponent = await fixture(
          html`
          <${tagBaseCheckboxFilter}
            .filter=${basefilterResults}
            .filterConfiguration=${baseFilterConfiguration}
            .onFilterUpdated=${() => {return;}} 
            .onApplyFilters=${onApplyFiltersSpy}
          >
          </${tagBaseCheckboxFilter}>
        `);

        assert.isNotNull(getApplyButton(el));
        assert.isNotNull(getCancelButton(el));  
        
        // Select all the items
        getMenuItems(el)?.forEach((item: HTMLElement) => {
          item.click();
        });

       el.requestUpdate();
        await elementUpdated(el);

        assert.isNotNull(getResetButton(el));
        assert.equal(el.selectedValues.length, 3);
        assert.equal(el.submittedFilterValues.length, 0);
        expect(onApplyFiltersSpy.callCount).to.equal(0);
        onApplyFiltersSpy.resetHistory();

        // Needed to be able to click on the "apply" button (disabled otherwise)
       el.requestUpdate();
        await elementUpdated(el);

        // Apply filters
        getApplyButton(el)?.click();

        // Unselect all the items
        getMenuItems(el)?.forEach((item: HTMLElement) => {
          item.click();
        });

       el.requestUpdate();
        await elementUpdated(el);
        
        assert.equal(el.selectedValues.length, 0);
        assert.equal(el.submittedFilterValues.length, 3);
        assert.isNotNull(getApplyButton(el)?.getAttribute("disabled"));

      });

      it("should reset selected values without submitting if no filter values are already submitted", async () => {
        
        const el: CheckboxFilterComponent = await fixture(
          html`
          <${tagBaseCheckboxFilter}
            .filter=${basefilterResults}
            .filterConfiguration=${baseFilterConfiguration}
            .onFilterUpdated=${() => {return;}} 
            .onApplyFilters=${onApplyFiltersSpy}
          >
          </${tagBaseCheckboxFilter}>
        `);
        
        // Reset button shouldn't be there
        assert.isNull(getResetButton(el));

        // Select all values
        getMenuItems(el)?.forEach((item: HTMLElement) => {
          item.click();
        });

       el.requestUpdate();
        await elementUpdated(el);
        
        assert.isNotNull(getResetButton(el));

        assert.equal(el.selectedValues.length, 3);
        assert.equal(el.submittedFilterValues.length, 0);
        expect(onApplyFiltersSpy.callCount).to.equal(0);
        
        // Reset all values
        getResetButton(el)?.click();

       el.requestUpdate();
        await elementUpdated(el);
        
        assert.isNull(getResetButton());
        assert.equal(el.selectedValues.length, 0);
        assert.equal(el.submittedFilterValues.length, 0);
        expect(onApplyFiltersSpy.callCount).to.equal(0);

      });

      it("should reset selected values and submit if some filter values are already submitted", async () => {
        
        const el: CheckboxFilterComponent = await fixture(
          html`
          <${tagBaseCheckboxFilter}
            .filter=${basefilterResults}
            .filterConfiguration=${baseFilterConfiguration}
            .onFilterUpdated=${() => {return;}} 
            .onApplyFilters=${onApplyFiltersSpy}
          >
          </${tagBaseCheckboxFilter}>
        `);

        // Reset button shouldn't be there
        assert.isNull(getResetButton(el));

        // Select all the items
        getMenuItems(el)?.forEach((item: HTMLElement) => {
          item.click();
        });

       el.requestUpdate();
        await elementUpdated(el);

        assert.isNotNull(getResetButton(el));
        assert.equal(el.selectedValues.length, 3);
        assert.equal(el.submittedFilterValues.length, 0);
        expect(onApplyFiltersSpy.callCount).to.equal(0);
        onApplyFiltersSpy.resetHistory();

        // Needed to be able to click on the "apply" button (disabled otherwise)
       el.requestUpdate();
        await elementUpdated(el);

        // Apply filters
        getApplyButton(el)?.click();
        
        assert.equal(el.submittedFilterValues.length, 3);
        expect(onApplyFiltersSpy.callCount).to.equal(1);
        onApplyFiltersSpy.resetHistory();
        
        // Reset all values
        getResetButton(el)?.click();
       el.requestUpdate();
        await elementUpdated(el);
        
        assert.isNull(getResetButton(el));
        assert.equal(el.selectedValues.length, 0);
        assert.equal(el.submittedFilterValues.length, 0);
        expect(onApplyFiltersSpy.callCount).to.equal(1);
      });
    });    
});