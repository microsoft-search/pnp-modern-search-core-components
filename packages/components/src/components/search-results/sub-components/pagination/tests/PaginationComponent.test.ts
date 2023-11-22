/* eslint-disable lit/no-invalid-html */
/* eslint-disable lit/binding-positions */
import { fixture, assert, html, expect, elementUpdated, defineCE, unsafeStatic } from "@open-wc/testing";
import sinon from "sinon";
import { PaginationComponent } from "../PaginationComponent";

//#region Spies
const onPageNumberUpdated = sinon.spy();
//#endregion

//#region Components
let basePaginationComponent: PaginationComponent;
//#endregion

//#region Selectors
const getPageInRangeButtons = (component: PaginationComponent = basePaginationComponent) => component?.shadowRoot?.querySelectorAll<HTMLButtonElement>("button[data-ref='page'");
const getFirstPageButton = (component: PaginationComponent = basePaginationComponent) => component?.shadowRoot?.querySelector<HTMLButtonElement>("button[data-ref='first'");
const getLastPageButton = (component: PaginationComponent = basePaginationComponent) => component?.shadowRoot?.querySelector<HTMLButtonElement>("button[data-ref='last'");
const getDotButtons = (component: PaginationComponent = basePaginationComponent) => component?.shadowRoot?.querySelectorAll<HTMLElement>("[data-ref='dot'");
const getNextButton = (component: PaginationComponent = basePaginationComponent) => component?.shadowRoot?.querySelector<HTMLButtonElement>("button[data-ref='next-btn'");
const getPreviousButton = (component: PaginationComponent = basePaginationComponent) => component?.shadowRoot?.querySelector<HTMLButtonElement>("button[data-ref='previous-btn'");
//#endregion

describe("pnp-pagination ", () => {

    describe("common", () => {

      const tagName = defineCE(PaginationComponent);
      const tag = unsafeStatic(tagName);

      beforeEach(async () => {

          basePaginationComponent = await fixture(
              html`<${tag}
                  .totalItems=${50}
                  .itemsCountPerPage=${3} 
                  .numberOfPagesToDisplay=${2}
                  .onPageNumberUpdated=${onPageNumberUpdated}
              >
              </${tag}>
          `);
          
          onPageNumberUpdated.resetHistory();
      });

      it("should be defined", () => {
        assert.instanceOf(basePaginationComponent, PaginationComponent);
      });

      it("should display the correct number of pages in range", async () => {

        assert.equal(getPageInRangeButtons()?.length, 1); // = 'numberOfPagesToDisplay' including the first page
        assert.isNotNull(getFirstPageButton()); // The first page button should be always here and is counted as part of the range only on the first page
        assert.isNotNull(getLastPageButton());
        assert.equal(getDotButtons()?.length, 1);

        basePaginationComponent.numberOfPagesToDisplay = 3;
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(getPageInRangeButtons()?.length, 2);
        assert.isNotNull(getFirstPageButton());
        assert.isNotNull(getLastPageButton());

        // Dots should be display after page 1
        basePaginationComponent.setPageNumber(4);
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(getPageInRangeButtons()?.length, 3);
        assert.equal(getDotButtons()?.length, 2);
        assert.isNotNull(getFirstPageButton());
        assert.isNotNull(getLastPageButton());
      });

      it("should calculate the number of pages correctly", async () => {

        assert.equal(basePaginationComponent.numberOfPages, 17);
        basePaginationComponent.totalItems = 100;
        basePaginationComponent.itemsCountPerPage = 25;
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.numberOfPages, 4);
      });

      it("should display previous/next button correctly", async () => {

        assert.equal(basePaginationComponent.currentPageNumber, 1);
        assert.exists(getPreviousButton()?.getAttribute("disabled"));
        assert.notExists(getNextButton()?.getAttribute("disabled"));

        // Go to page 2
        getNextButton()?.click();
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentPageNumber, 2);
        assert.notExists(getPreviousButton()?.getAttribute("disabled"));
        expect(onPageNumberUpdated.callCount).to.equal(1);

        // Go to page 3
        getNextButton()?.click();
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentPageNumber, 3);
        assert.notExists(getPreviousButton()?.getAttribute("disabled"));
        expect(onPageNumberUpdated.callCount).to.equal(2);

        // Go to page 2
        getPreviousButton()?.click();
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentPageNumber, 2);
        assert.notExists(getPreviousButton()?.getAttribute("disabled"));
        expect(onPageNumberUpdated.callCount).to.equal(3);

        // Go to page 1
        getPreviousButton()?.click();
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentPageNumber, 1);
        assert.exists(getPreviousButton()?.getAttribute("disabled"));
        expect(onPageNumberUpdated.callCount).to.equal(4);

      });

      it("should hande page numbers range correctly", async () => {

        assert.equal(basePaginationComponent.currentRangeStart, 1);
        assert.equal(basePaginationComponent.currentRangeEnd, 2);

        basePaginationComponent.setPageNumber(4);
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentRangeStart, 3);
        assert.equal(basePaginationComponent.currentRangeEnd, 4);

        // Select a page that is not in the next logical range
        basePaginationComponent.setPageNumber(7);
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentRangeStart, 7);
        assert.equal(basePaginationComponent.currentRangeEnd, 8);

        basePaginationComponent.setPageNumber(4);
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        // Select a page that is not in the previous logical range
        assert.equal(basePaginationComponent.currentRangeStart, 3);
        assert.equal(basePaginationComponent.currentRangeEnd, 4);

      });

      it("should handle first and last page", async () => {

        expect(onPageNumberUpdated.callCount).to.equal(0);
        assert.equal(basePaginationComponent.currentPageNumber, 1);

        getLastPageButton()?.click();
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentPageNumber, 17);
        expect(onPageNumberUpdated.callCount).to.equal(1);

        getFirstPageButton()?.click();
        basePaginationComponent.requestUpdate();
        await elementUpdated(basePaginationComponent);

        assert.equal(basePaginationComponent.currentPageNumber, 1);
        expect(onPageNumberUpdated.callCount).to.equal(2);
      });

    });
});
