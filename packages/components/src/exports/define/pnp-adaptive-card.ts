
import { AdaptiveCardComponent } from "../../components/adaptive-card/AdaptiveCardComponent";
import { ComponentElements } from "../../common/Constants";

customElements.define([ComponentElements.AdaptiveCardComponent].toString(), AdaptiveCardComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.AdaptiveCardComponent]: AdaptiveCardComponent;
  }
}