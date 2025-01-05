import {html} from "lit";
import {BaseComponent} from "../BaseComponent";
import {property} from "lit/decorators.js";
import {ILocalizedString} from "../../models/common/ILocalizedString";

export class LabelComponent extends BaseComponent {
  @property({
    type: String,
    attribute: "label",
    converter: {
      fromAttribute: (value) => {
        try {
          return JSON.parse(value) as ILocalizedString;
        } catch {
          return value;
        }
      },
    },
  })
  label: ILocalizedString | string = "";

  protected override render() {
    return html`<span class="${this.theme}"
      ><span data-ref="label" class="font-primary text-textColor dark:text-textColorDark"
        >${this.getLocalizedString(this.label)}</span
      ></span
    >`;
  }

  static override get styles() {
    return [
        BaseComponent.themeStyles, // Allow component to use theme CSS variables from design. The component is a first level component so it is OK to define them variables here
        BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
    ];
  }
}
