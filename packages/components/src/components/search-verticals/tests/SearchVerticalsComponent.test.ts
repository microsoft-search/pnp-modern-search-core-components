import { assert, elementUpdated, expect, fixture, html, oneEvent } from "@open-wc/testing";
import { SearchVerticalsComponent } from "../SearchVerticalsComponent";
import { strings as stringsFr } from "../../../loc/strings.fr-fr";
import { strings as stringsEn } from "../../../loc/strings.default";
import { LocalizationHelper } from "@microsoft/mgt-element";
import { ISearchVerticalEventData } from "../../../models/events/ISearchVerticalEventData";
import { EventConstants } from "../../../common/Constants";
import { baseVerticalSettings } from "./mocks";
import sinon from "sinon";
import { UrlHelper } from "../../../helpers/UrlHelper";

import "../../../exports/define/pnp-search-verticals";

//#region Selectors
const getVerticals = (component: SearchVerticalsComponent) => component?.shadowRoot?.querySelectorAll<HTMLElement>("fast-tab");
const getVerticalByName = (name: string, component: SearchVerticalsComponent) => component?.shadowRoot?.querySelector<HTMLElement>(`fast-tab[data-name='${name}']`);
const getVerticalByKey = (key: string, component: SearchVerticalsComponent) => component?.shadowRoot?.querySelector<HTMLElement>(`fast-tab[data-key='${key}']`);
//#endregion

describe("pnp-search-verticals", async () => {

  describe("common", async () => {

    beforeEach(async () => {

      const el: SearchVerticalsComponent = await fixture(html`<pnp-search-verticals .verticals=${baseVerticalSettings}></pnp-search-verticals>`);

      const newUrl = UrlHelper.removeQueryStringParam("v",window.location.href);
      window.history.pushState({path:newUrl}, "", newUrl);

      LocalizationHelper.strings = stringsEn;
      el.requestUpdate();
      await elementUpdated(el);
    });

    it("should be defined", async () => {
        const el = document.createElement("pnp-search-verticals");
        assert.instanceOf(el, SearchVerticalsComponent);
    });

    it("should display verticals according to the configuration", async () => {

        const el: SearchVerticalsComponent = await fixture(html`<pnp-search-verticals .verticals=${baseVerticalSettings}></pnp-search-verticals>`);
          
        // Check UI
        assert.equal(getVerticals(el)?.length, 2);
        assert.isNotNull(getVerticalByKey("tab1",el));
        assert.isNotNull(getVerticalByKey("tab2",el));

        // Check data
        assert.equal(el.verticals.length, 2);
    });

    it("should support localization for vertical name", async () => {

      const el: SearchVerticalsComponent = await fixture(html`<pnp-search-verticals .verticals=${baseVerticalSettings}></pnp-search-verticals>`);

      assert.isNotNull(getVerticalByName("Tab 1",el));
      assert.isNotNull(getVerticalByName("Tab 2",el));

      // Load fr-fr strings
      LocalizationHelper.strings = stringsFr;
     el.requestUpdate();
      await elementUpdated(el);

      assert.isNotNull(getVerticalByName("Onglet 1",el));
      assert.isNotNull(getVerticalByName("Tab 2",el)); // Shouldn't change as it is not a localized string
    });

    it("shoud trigger an event with selected vertical data when user clicks on the tab", async () => {
      
      const el: SearchVerticalsComponent = await fixture(html`<pnp-search-verticals .verticals=${baseVerticalSettings}></pnp-search-verticals>`);
      assert.equal(el.getAttribute("selected-key"), "tab1");

      const listener = oneEvent(el, EventConstants.SEARCH_VERTICAL_EVENT);
      getVerticalByKey("tab2",el)?.click();
      await elementUpdated(el);

      assert.equal(el.getAttribute("selected-key"), "tab2");
      const { detail } = await listener;

      assert.equal((detail as ISearchVerticalEventData).selectedVertical.key, "tab2");
    });
  });

  it("should support vertical template", async () => {

    const el: SearchVerticalsComponent = await fixture(
      html`
        <pnp-search-verticals settings=${JSON.stringify(baseVerticalSettings)}>
          <template data-type="verticals">
            <div  data-ref="vertical-tab-{{vertical.key}}"
                  data-for="vertical in verticals" 
                  data-props="{{@click: onTemplateVerticalSelected}}">
                    <div data-ref="vertical-name-{{vertical.key}}">
                        {{vertical.displayName}}
                    </div>

                    <div data-ref="vertical-selected" data-if="vertical.key === selectedVerticalKey">
                        {{vertical.key}}
                    </div>
            </div>               
          </template>
        </pnp-search-verticals>
      `
    );

    assert.equal(el?.querySelectorAll<HTMLDivElement>("div[data-ref^='vertical-tab']").length, 2);  
    assert.equal(el?.querySelector<HTMLDivElement>("div[data-ref='vertical-name-tab1']")?.innerText, "Tab 1");  
    assert.equal(el?.querySelector<HTMLDivElement>("div[data-ref='vertical-selected']")?.innerText, "tab1");  

    el?.querySelector<HTMLDivElement>("div[data-ref='vertical-tab-tab2']")?.click();
    el.requestUpdate();
    await elementUpdated(el);

    assert.equal(el?.querySelector<HTMLDivElement>("div[data-ref='vertical-selected']")?.innerText, "tab2"); 
    assert.equal(el?.selectedVerticalKey, "tab2");
  });

  describe("default query string parameter", async () => {


    before(() => {
        const newUrl = UrlHelper.addOrReplaceQueryStringParam(window.location.href, "v","tab2");
        window.history.pushState({path:newUrl}, "", newUrl);
    });

    it("should select default tab according to query string parameter", async () => {
      
      const el: SearchVerticalsComponent = await fixture(html`<pnp-search-verticals .verticals=${baseVerticalSettings}></pnp-search-verticals>`);
      const selectVerticalSpy = sinon.spy(el, "selectVertical");
      assert.equal(el.getAttribute("selected-key"), "tab2");
      expect(selectVerticalSpy.callCount).to.equal(0);
    });

    after(() => {
      // Do not revert window.location.href to avoid infinite loop
    });

  });

});