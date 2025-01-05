import * as React from "react";
import { IFormDataCollectionProps } from "./IFormDataCollectionProps";
import { IFormDataCollectionState } from "./IFormDataCollectionState";
import { Guid } from "@microsoft/sp-core-library";
import { isEqual } from "@microsoft/sp-lodash-subset";
import { Label } from "office-ui-fabric-react";
import { IRow, ItemRepeater } from "../ItemRepeater/ItemRepeater";
import { FormBuilder } from "../FormBuilder/FormBuilder";
import { IItemRepeaterValue } from "../ItemRepeater/IItemRepeaterValue";

export class FormDataCollection<T> extends React.Component<IFormDataCollectionProps<T>, IFormDataCollectionState<T>> {

    constructor(props: IFormDataCollectionProps<T>) {

        super(props);
        this.state = {
            defaultRows: [],
            values: []
        };

        this.onRenderNewRow = this.onRenderNewRow.bind(this);
        this.onRowDeleted = this.onRowDeleted.bind(this);
        this.onRowAdded = this.onRowAdded.bind(this);
        this.onRowsOrderChanged = this.onRowsOrderChanged.bind(this);
    }

    public render(): React.ReactNode {

        
        return  <>  
                    {this.props.label ? <Label>{this.props.label}</Label> : null }
                    <ItemRepeater
                        ref={this.props.itemRepeaterProps?.innerRef}
                        {...this.props.itemRepeaterProps}
                        defaultRows={this.state.defaultRows}
                        onRenderNewRow={this.onRenderNewRow}
                        onRowDeleted={this.onRowDeleted}
                        onRowAdded={this.onRowAdded}
                        onRowsOrderChanged={this.onRowsOrderChanged}
                    />
                </>;        
    }

    public componentDidMount(): void {
        this.initializeState();
    }

    public componentDidUpdate(prevProps: Readonly<IFormDataCollectionProps<T>>): void {
        
        // Important to not recreate rows every time when items update
        // If parent initializes items from the componentDidMount method, items will be likely empty on the first render. The stateKey ensure the default rows initialized is controlled by the parent knowing when the items are "ready"
        if (!isEqual(prevProps.stateKey, this.props.stateKey)) {
            this.initializeState();
        }
    }

    private initializeState(): void {

        if (this.props.items) {

            const repeatedItems = this.fromOriginalValue(this.props.items);
            const defaultRows: IRow[] = repeatedItems.map(repeatedItem => {

                return {
                    id: repeatedItem.id,
                    renderItem: () => {
                        return this.renderRow(repeatedItem.id, repeatedItem.value);  
                    },
                    locked: this.props.itemRepeaterProps.isItemLocked ? this.props.itemRepeaterProps.isItemLocked(repeatedItem.value) : false
                }
            });

            this.setState({
                defaultRows: defaultRows,
                values: repeatedItems
            });
        }  
    }

    private onRenderNewRow(id: string): IRow {

        const newRow = {
            id: id,
            renderItem: (didMount: boolean) => {
                return this.renderRow(id, this.props.newRowDefaultObject(), didMount);
            },
            locked: false // If we can create a row, it makes no sens to lock it
        } as IRow;

        return newRow;
    }

    private onRowDeleted(id: string): void {

        const fieldValues = this.state.values.filter(value => value.id !== id);

        this.setState({
            values: fieldValues
        });

        this.props.onChange(this.toOriginalValue(fieldValues));
    }

    public onRowAdded(id: string): void {
        
        if (this.props.onRowAdded) {
            this.props.onRowAdded(id);
        }
        
    }

    public onRowsOrderChanged(rows: IRow[]): void {

        // Updte the sort idx corresponding to that row
        let fieldValues: IItemRepeaterValue<T>[] = [];

        // Get the field values in the same order as rows
        fieldValues = rows.map((row, i) => {            
            const filterConfiguration = this.state.values.filter(f => f.id === row.id)[0];
            return filterConfiguration;
        });

        this.setState( {
            values: fieldValues
        });

        this.props.onRowsOrderChanged(this.toOriginalValue(fieldValues));
    }

    private onValueUpdated(fieldId: string, newValue?: T, errors?: Map<string,string>): void {

        let fieldValues: IItemRepeaterValue<T>[] = [];

        if (this.state.values.some(t => t.id === fieldId)) {
            
            fieldValues = this.state.values.map(value => {
                if (value.id === fieldId) {
                    return {
                        id: value.id,
                        value: newValue
                    };
                } else {
                    return value;
                }
            });
        } else {
           
            fieldValues = [
                ...this.state.values,
                {
                    id: fieldId,
                    value: newValue
                }
            ];
        }

        this.setState( {
            values: fieldValues
        });

        this.props.onChange(this.toOriginalValue(fieldValues), errors);
    }

    private fromOriginalValue(items: T[]) : IItemRepeaterValue<T>[] {

        return items.map(item => {
            return {
                id: Guid.newGuid().toString(),
                value: item
            }
        });  
    }

    private toOriginalValue(items: IItemRepeaterValue<T>[]): T[] {
        return items.map(item => item.value);
    }

    private renderRow(rowId: string, value: T, didMount?: boolean): React.ReactNode {
        
        // Determine if an existing value with this id already exists if the row already mounted                
        let dataObject;
        const existingValue = this.state.values.filter(c => c.id === rowId);
        if (existingValue.length > 0) {
            dataObject = existingValue[0].value;
        }
         
        return  <FormBuilder
                    key={rowId}
                    dataObject={didMount && dataObject ? dataObject : value}
                    validateOnLoad={this.props.validateOnLoad}
                    fields={this.props.formConfiguration}
                    onFormValuesUpdated={(value, errors) => this.onValueUpdated(rowId, value,errors)}
                />;
    }


}