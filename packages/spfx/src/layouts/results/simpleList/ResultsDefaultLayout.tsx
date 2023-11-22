import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { BaseLayout } from "../../../models/common/BaseLayout";
import { BuiltinTemplateSlots, ILayoutSlot, SlotType } from "../../../models/common/ILayoutSlot";
import { ServiceScope } from "@microsoft/sp-core-library";
import { ILayoutProps } from "../../../models/common/ILayout";

export interface IResultsDefaultLayoutProperties extends ILayoutProps{
}

export class ResultsDefaultLayout extends BaseLayout<IResultsDefaultLayoutProperties> {


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
                slotName: "ACVideoUrl",
                slotValue: "",
                slotType: SlotType.RawValue,
                disabled: true
            }
        ];
    }


    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[] {
       
        const isItemLocked = (item: ILayoutSlot): boolean => {
            return this._defaultSlots.map(s => s.slotName).indexOf(item.slotName) !== -1;
        };
       
        return [
            this.getPropertyPaneSlotField(availableFields, true, isItemLocked)
        ]
    }
}