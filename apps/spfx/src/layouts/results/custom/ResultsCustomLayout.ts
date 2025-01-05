import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { BaseLayout } from "../../../models/common/BaseLayout";
import { BuiltinTemplateSlots, ILayoutSlot, SlotType } from "../../../models/common/ILayoutSlot";
import { ServiceScope } from "@microsoft/sp-core-library";
import { ILayoutProps } from "../../../models/common/ILayout";

export interface IResultsCustomLayoutProperties extends ILayoutProps {
}

export class ResultsCustomLayout extends BaseLayout<IResultsCustomLayoutProperties> {

    constructor(serviceScope: ServiceScope) {
        super(serviceScope);
        
        this._defaultSlots = [
            {
                slotName: BuiltinTemplateSlots.Title,
                slotValue: 'resource.fields.title',
                slotType: SlotType.DynamicField,
            },
            {
                slotName: BuiltinTemplateSlots.Path,
                slotValue: 'resource.webUrl',
                slotType: SlotType.DynamicField,
            },
            {
                slotName: BuiltinTemplateSlots.Summary,
                slotValue: 'summary',
                slotType: SlotType.DynamicField
            },
            {
                slotName: BuiltinTemplateSlots.FileType,
                slotValue: 'resource.fields.filetype',
                slotType: SlotType.DynamicField
            }
        ];
    }

    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[] {
              
        return [
            this.getPropertyPaneSlotField(availableFields, false, (item: ILayoutSlot) => {
                return false;
            })
        ]
    }
}