import * as React from "react";
import { ILayoutSlotFieldProps } from "./ILayoutSlotFieldProps";
import { ILayoutSlotFieldState } from "./ILayoutSlotFieldState";
import { Dropdown, IDropdownOption, Stack, TextField, Toggle } from "office-ui-fabric-react";
import { SlotType } from "../../models/common/ILayoutSlot";
import { sortBy, uniqBy } from "@microsoft/sp-lodash-subset";

export class LayoutSlotField extends React.Component<ILayoutSlotFieldProps, ILayoutSlotFieldState> {

    constructor(props: ILayoutSlotFieldProps) {
        super(props);

        this.state = {
            slot: props.defaultValue
        };
    }

    public render(): React.ReactNode {
        const fieldsOptions =   this.props.dynamicValues?.map(value => { 
                                    return { key: value, text: value}
                                });

        const options = sortBy(uniqBy([
                            {
                                key: this.state.slot.slotValue, 
                                text: this.state.slot.slotValue
                            }, 
                            ...fieldsOptions
                        ], 'key'), 'key');

        return  <>
                <Stack tokens={{ childrenGap: 12 }}>
                    <TextField
                        label="Slot name"                        
                        defaultValue={this.state.slot.slotName}
                        disabled={this.state.slot.disabled}
                        description=""
                        onChange={(ev, newValue: string) => {
                            const slot = {...this.state.slot};
                            slot.slotName = newValue;
                            this.setState({
                                slot:slot
                            }, () => {
                                this.props.onChange(slot);
                            });
                        }}
                    />
                    {this.state.slot.slotType === SlotType.DynamicField ?
                        <Dropdown                        
                            defaultSelectedKey={this.state.slot.slotValue} 
                            label="Slot value"
                            selectedKey={this.state.slot.slotValue}
                            options={options}               
                            onChange={(ev, option: IDropdownOption, index: number) => {
                                const slot = {...this.state.slot};
                                slot.slotValue = option.key as SlotType;
                                this.setState({
                                    slot:slot
                                }, () => {
                                    this.props.onChange(slot);
                                });
    
                            }}            
                        />
                        :
                        <TextField
                            label="Slot value"
                            multiline
                            description="Configure a query to get results to see the list of available fields"
                            defaultValue={this.state.slot.slotValue}
                            onChange={(ev, newValue: string) => {
                                const slot = {...this.state.slot};
                                slot.slotValue = newValue;
                                this.setState({
                                    slot:slot
                                }, () => {
                                    this.props.onChange(slot);
                                });
                            }}
                        /> 
                    }
                    <Toggle 
                        label="Use dynamic field value"
                        checked={this.state.slot.slotType === SlotType.DynamicField}
                        onChange={(ev, checked: boolean) => {
                            const slot = {...this.state.slot};
                            slot.slotType = checked ? SlotType.DynamicField : SlotType.RawValue
                            this.setState({
                                slot:slot
                            }, () => {
                                this.props.onChange(slot);
                            });

                        }}
                    />                    
                </Stack>
                </>;

    }
}