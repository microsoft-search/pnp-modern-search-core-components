/* eslint-disable @typescript-eslint/no-explicit-any */
import {assert, elementUpdated, fixture, html} from "@open-wc/testing";
import {LabelComponent} from "../LabelComponent";

import {strings as enStrings} from "../../../loc/strings.default";
import {strings as frStrings} from "../../../loc/strings.fr-fr";

import "../../../exports/define/pnp-label";
import {LocalizationHelper} from "@microsoft/mgt-element";

//#region Selectors
const getLabel = (component: LabelComponent) =>
  component?.shadowRoot?.querySelector<HTMLSpanElement>("[data-ref='label']");
//#endregion

describe("pnp-search-input", () => {
  describe("common", () => {
    it("should be defined", () => {
      const el = document.createElement("pnp-label");
      assert.instanceOf(el, LabelComponent);
    });

    it("should localize the label according to the current language", async () => {
      // Set the language to default
      LocalizationHelper.strings = enStrings as any;

      const el: LabelComponent = await fixture(
        html`<pnp-label label='{"default": "Hello", "fr-fr": "Bonjour"}'> </pnp-label>`
      );

      const label = getLabel(el);
      assert.equal(label?.innerText, "Hello");

      // Change language to fr-fr
      // Because esbuild doesn't support dynamic import, we need to import the fr-fr strings directly
      LocalizationHelper.strings = frStrings as any;

      el.requestUpdate();
      await elementUpdated(el);

      assert.equal(label?.innerText, "Bonjour");
    });
  });
});
