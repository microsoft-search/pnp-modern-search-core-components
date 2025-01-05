import {LabelComponent} from "../../components/label/LabelComponent";
import {ComponentElements} from "../../common/Constants";

customElements.define([ComponentElements.LabelComponent].toString(), LabelComponent);

declare global {
  interface HTMLElementTagNameMap {
    [ComponentElements.LabelComponent]: LabelComponent;
  }
}
