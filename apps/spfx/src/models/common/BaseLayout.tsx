import { IPropertyPaneField } from "@microsoft/sp-property-pane";
import { ServiceScope } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ILayout, ILayoutProps } from "./ILayout";
import { ILayoutSlot, SlotType } from "./ILayoutSlot";
import { isEqual } from "@microsoft/sp-lodash-subset";
import * as React from "react";
import { ConfigurationPanel } from "../../controls/ConfigurationPanel/ConfigurationPanel";
import { IConfigurationTab } from "../../controls/ConfigurationPanel/IConfigurationTab";
import { ConfigurationFieldType, IConfigurationTabField } from "../../controls/ConfigurationPanel/IConfigurationTabField";
import { LayoutSlotField } from "../../controls/LayoutSlotField/LayoutSlotField";
import { ItemRepeater } from "../../controls/ItemRepeater/ItemRepeater";
import { PropertyPaneFormDataCollection } from "../../propertyPane/PropertyPaneFormDataCollection/PropertyPaneFormDataCollection";

export abstract class BaseLayout<T extends ILayoutProps> implements ILayout {

    private _properties!: T;
    private _context: WebPartContext;
    protected serviceScope: ServiceScope;
    protected _defaultSlots: ILayoutSlot[];

    private _itemRepeaterRef = React.createRef<ItemRepeater<ILayoutSlot>>();
    private _lastCreatedConfigurationPanelRef: React.RefObject<ConfigurationPanel<ILayoutSlot>> = null;
    private _lastRowId: string;

    get properties(): T {
        return this._properties;
    }

    set properties(properties: T) {
        this._properties = properties;
    }

    get context(): WebPartContext {
        return this._context;
    }

    set context(context: WebPartContext) {
        this._context = context;
    }

    public constructor(serviceScope: ServiceScope) {
        this.serviceScope = serviceScope;
    }

    public async onInit(): Promise<void> {
        this.properties.slots = this.properties.slots ? this.properties.slots : this._defaultSlots;
        return;
    }

    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<unknown>[] {
        return [];
    }

    /**
     * Gets the property pane slots field
     * @param availableFields the list of available fields from results
     * @param disabled if the 'Add new slot' button should be disabled
     * @param isItemLocked function determining if the slot should be locked
     */
    protected getPropertyPaneSlotField(availableFields: string[], disabled: boolean, isItemLocked: (item: ILayoutSlot) => boolean): PropertyPaneFormDataCollection<ILayoutSlot> {
        
        const newSlot = {
            slotName: "",
            slotType: SlotType.RawValue,
            slotValue: ""
        };

        const slotTabsConfiguration: IConfigurationTab[] = [
            {
                name: "Settings",
                fields: [
                    {
                        type: ConfigurationFieldType.Custom,
                        targetProperty: null,
                        onCustomRender: (field, defaultValue, onUpdate) => {
                            return  <LayoutSlotField
                                        defaultValue={defaultValue}
                                        onChange={(value) => {
                                            onUpdate(field, value);
                                        }}
                                        dynamicValues={availableFields}
                                    />;
                        }
                    }
                ]
            }
        ];

        const mainFormFields: IConfigurationTabField[] = [
            {
                type: ConfigurationFieldType.Custom,
                targetProperty: null,
                onCustomRender: (field, defaultValue, onUpdate) => {

                    this._lastCreatedConfigurationPanelRef = React.createRef<ConfigurationPanel<ILayoutSlot>>();

                    return  <ConfigurationPanel<ILayoutSlot>
                                ref={this._lastCreatedConfigurationPanelRef}
                                configurationTabs={slotTabsConfiguration}
                                renderRowTitle={(slot: ILayoutSlot) => { return slot.slotName }}
                                onFormSave={(formData) => { onUpdate(field, formData)}}
                                dataObject={defaultValue}
                                renderPanelTitle={() =>"Add new slot"}
                                onFormDismissed={(configuration: ILayoutSlot) => {
                                        
                                    if (isEqual(configuration, newSlot)) {
                                        // Remove row as no item has been saved
                                        this._itemRepeaterRef.current.deleteItemRow(this._lastRowId)
                                    }
                                }}
                            />;
                }
            }
        ];
        
        return new PropertyPaneFormDataCollection<ILayoutSlot>('layoutProperties.slots', {
                items: this.properties.slots,
                label: "Available slots",
                stateKey: JSON.stringify(this.properties.slots),
                itemRepeaterProps: {
                    innerRef: this._itemRepeaterRef,
                    addButtonLabel: "Add new slot",
                    disabled: disabled,
                    isItemLocked: isItemLocked
                },
                formConfiguration: mainFormFields,
                newRowDefaultObject: () => newSlot,
                onRowAdded: (rowId: string) => {
                    // Save the row id to be able to delete it afterwards
                    this._lastRowId = rowId;
                    // Get the last created row (empty at this point) and open the panel
                    this._lastCreatedConfigurationPanelRef.current.togglePanel();
                }
            });
    }

    public onPropertyUpdate(propertyPath: string, oldValue: unknown, newValue: unknown): void {
        // Do nothing by default      
    }
    
}