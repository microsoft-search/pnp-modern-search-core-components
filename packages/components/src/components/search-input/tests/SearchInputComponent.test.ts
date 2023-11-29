import { assert } from "@open-wc/testing";
import { SearchInputComponent } from "../SearchInputComponent";

import "../../../exports/define/pnp-search-input";

//#region Selectors
//const getClearSearchbox = (component: SearchInputComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[part='clear-button']");
//const getSearchbox = (component: SearchInputComponent) => component?.shadowRoot?.querySelector<HTMLInputElement>("#searchbox");
//#endregion
describe("pnp-search-input", () => {

    describe("common", () => {

        it("should be defined", () => {
            const el = document.createElement("pnp-search-input");
            assert.instanceOf(el, SearchInputComponent);
        });
    });
});