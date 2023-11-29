
import { ErrorMessageComponent } from "../../components/search-results/sub-components/error-message/ErrorMessageComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.ErrorMessageComponent].toString(), ErrorMessageComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.ErrorMessageComponent]: ErrorMessageComponent;
  }
}