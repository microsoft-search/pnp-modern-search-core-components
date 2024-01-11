import { IPropertyPaneDropdownOption, IPropertyPaneField, PropertyPaneDropdown, PropertyPaneDropdownOptionType, PropertyPaneSlider } from "@microsoft/sp-property-pane";
import { BaseLayout } from "../../../models/common/BaseLayout";
import { BuiltinTemplateSlots, ILayoutSlot, SlotType } from "../../../models/common/ILayoutSlot";
import { ServiceScope } from "@microsoft/sp-core-library";
import { ILayoutProps } from "../../../models/common/ILayout";
import * as commonStrings from "CommonStrings";

export interface IResultsTilesLayoutProperties extends ILayoutProps {

    /**
     * The prefered number of cards per row per sizes (Small, Medium, Large, Extra Large, Extra Extra Large)
     * Corresponds to TailwindCSS container queries breakpoints https://github.com/tailwindlabs/tailwindcss-container-queries?tab=readme-ov-file#configuration
     */
    mdCardNumberPerRow: number;
    smCardNumberPerRow: number;
    lgCardNumberPerRow: number;
    xlCardNumberPerRow: number;
    xxlCardNumberPerRow: number;

    /**
     * The container width
     */
    containerWidth: string;
}

export class ResultsTilesLayout extends BaseLayout<IResultsTilesLayoutProperties> {


    constructor(serviceScope: ServiceScope) {
        super(serviceScope);

        this._defaultSlots =  [
            {
                slotName: BuiltinTemplateSlots.Title,
                slotValue: 'resource.fields.title',
                slotType: SlotType.DynamicField,
                disabled: true
            },
            {
                slotName: "Subtitle",
                slotValue: "",
                slotType: SlotType.DynamicField,
                disabled: true
            },
            {
                slotName: BuiltinTemplateSlots.Path,
                slotValue: 'resource.webUrl',
                slotType: SlotType.DynamicField,
                disabled: true
            },
            {
                slotName: BuiltinTemplateSlots.Summary,
                slotValue: 'summary',
                slotType: SlotType.DynamicField,
                disabled: true
            },
            {
                slotName: BuiltinTemplateSlots.FileType,
                slotValue: 'resource.fields.filetype',
                slotType: SlotType.DynamicField,
                disabled: true
            },
            {
                slotName: "Thumbnail_Url",
                slotValue: 'thumbnailUrl',
                slotType: SlotType.DynamicField,
                disabled: true
            },
            {
                slotName: "Main_Category",
                slotValue: "",
                slotType: SlotType.RawValue,
                disabled: true
            },
            {
                slotName: "Secondary_Category",
                slotValue: "",
                slotType: SlotType.RawValue,
                disabled: true
            },
            {
                slotName: "Tags",
                slotValue: "",
                slotType: SlotType.RawValue,
                disabled: true
            },
            {
                slotName: "Image_Tag",
                slotValue: "",
                slotType: SlotType.RawValue,
                disabled: true
            }
        ];
    }

    public async onInit(): Promise<void> {

        this.properties.smCardNumberPerRow = this.properties.smCardNumberPerRow ? this.properties.smCardNumberPerRow : 1;
        this.properties.mdCardNumberPerRow = this.properties.mdCardNumberPerRow ? this.properties.mdCardNumberPerRow : 2;
        this.properties.lgCardNumberPerRow = this.properties.lgCardNumberPerRow ? this.properties.lgCardNumberPerRow : 3;
        this.properties.xlCardNumberPerRow = this.properties.xlCardNumberPerRow ? this.properties.xlCardNumberPerRow : 4;
        this.properties.xxlCardNumberPerRow = this.properties.xxlCardNumberPerRow ? this.properties.xxlCardNumberPerRow : 5;

        this.properties.containerWidth = this.properties.containerWidth ? this.properties.containerWidth : "md";

        return super.onInit();
    }

    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[] {
       
        const isItemLocked = (item: ILayoutSlot): boolean => {
            return this._defaultSlots.map(s => s.slotName).indexOf(item.slotName) !== -1;
        };

        const propertyName = `${this.properties.containerWidth}CardNumberPerRow`;
        const containerWidthOptions: IPropertyPaneDropdownOption[] = [
            {
                key: "",
                text: commonStrings.Layouts.ResultsTiles.ContainerWidthOptionsFieldLabel,
                type: PropertyPaneDropdownOptionType.Header
            },
            {
                key: "sm",
                text: commonStrings.Layouts.ResultsTiles.SmallWidth
            },
            {
                key: "md",
                text: commonStrings.Layouts.ResultsTiles.MediumWidth,
            },
            {
                key: "lg",
                text: commonStrings.Layouts.ResultsTiles.LargeWidth,
            },
            {
                key: "xl",
                text: commonStrings.Layouts.ResultsTiles.ExtraLargeWidth,
            },
            {
                key: "xxl",
                text: commonStrings.Layouts.ResultsTiles.ExtraExtraLargeWidth
            }
        ];
        
        return [
            PropertyPaneDropdown('layoutProperties.containerWidth', {
                label: commonStrings.Layouts.ResultsTiles.ContainerWidthFieldLabel,
                options: containerWidthOptions,
                selectedKey: this.properties.containerWidth
            }),
            PropertyPaneSlider(`layoutProperties.${propertyName}`, {
                label: `${containerWidthOptions.filter(f => f.key === this.properties.containerWidth)[0]?.text} - Number of cards to show`,
                min: 1,
                max: 5,
                step: 1,
                showValue: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: (this.properties as any)[propertyName]                
            }),
            this.getPropertyPaneSlotField(availableFields, true, isItemLocked)
        ]
    }
}