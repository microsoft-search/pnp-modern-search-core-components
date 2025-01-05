import * as React from "react";
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { isEqual } from "@microsoft/sp-lodash-subset";
import { IItemRepeaterProps, IconPlacement } from "./IItemRepeaterProps";
import { IItemRepeaterState } from "./IItemRepeaterState";
import { DetailsList, Selection, IDragDropContext, IDragDropEvents, IStackTokens, MarqueeSelection, Separator, Stack, IColumn, CheckboxVisibility, SelectionMode, IStackItemStyles, Label } from "office-ui-fabric-react";
import { Guid } from "@microsoft/sp-core-library";

export interface IRow {
    /**
     * Unique ID of the row
     */
    id: string;

    /**
     * Render function for a row.
     * @param didMount Flag indicating if the row has already been mounted once. Useful to determine first usage scenario (ex: popup)
     */
    renderItem(didMount?: boolean): React.ReactNode;


    locked?: boolean;
}

const stackTokens: IStackTokens = { childrenGap: 12 };
const stackItemStyles: IStackItemStyles = {
    root: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "space-between"
    }
}

export class ItemRepeater<T> extends React.Component<IItemRepeaterProps<T>, IItemRepeaterState> {

    private _selection: Selection;
    private _dragDropEvents: IDragDropEvents;
    private _draggedItem: IRow | undefined;
    private _draggedIndex: number;
 
    constructor(props: IItemRepeaterProps<T>) {
        super(props);

        this.state = {
            rows: [],
            mountedRowIds: []
        };

        this._selection = new Selection();
        this._dragDropEvents = this._getDragDropEvents();
        this._draggedIndex = -1;

        this.addItemRow = this.addItemRow.bind(this);
        this.deleteItemRow = this.deleteItemRow.bind(this);
    }

    public componentDidMount(): void {

        if (this.props.defaultRows) {
            this.setState({
                rows: [...this.props.defaultRows]
            });
        }
    }

    public componentDidUpdate(prevProps: Readonly<IItemRepeaterProps<T>>): void {

        if (!isEqual(prevProps.defaultRows, this.props.defaultRows)) {
            this.setState({
                rows: [...this.props.defaultRows]
            });
        }
    }

    public render(): JSX.Element {

        const renderAddButton: JSX.Element =    <ActionButton 
                                                    iconProps={{ iconName: 'Add' }}
                                                    onClick={this.addItemRow}
                                                    disabled={this.props.disabled}
                                                >
                                                    {this.props.addButtonLabel ? this.props.addButtonLabel : "Add new item"}
                                                </ActionButton>;

        let renderContent = <Stack tokens={stackTokens}>
                                {this.state.rows.map(row => {
                                    return this.renderRow(row);
                                })}
                            </Stack>;

        if (this.props.enableDragDrop) {

            const columns: IColumn[] = [
                { 
                    key: "id",
                    name: '',
                    minWidth: 100,
                    styles: {
                        root: {
                            width: "100%"
                        }
                    }
                }
            ];
            
            renderContent = <MarqueeSelection selection={this._selection}>
                                <DetailsList 
                                    columns={columns}
                                    items={this.state.rows}
                                    setKey="rows"
                                    selection={this._selection}
                                    selectionMode={SelectionMode.single}
                                    checkboxVisibility={CheckboxVisibility.hidden}
                                    selectionPreservedOnEmptyClick={true}
                                    dragDropEvents={this._dragDropEvents}
                                    compact={true}
                                    onRowDidMount={(row: IRow) => {
                                        this.setState({
                                            mountedRowIds: [...this.state.mountedRowIds,row.id]
                                        });
                                    }}
                                    isHeaderVisible={false}
                                    onRenderItemColumn={(row: IRow, index: number) => {
                                        return <Stack horizontal>{this.props.enableDragDrop ? <Label>{index}.</Label> : null}{this.renderRow(row)}</Stack>
                                    }}
                                />
                            </MarqueeSelection>;
        }

        return  <>
                    {renderContent}
                    {this.props.onRenderNewRow ? renderAddButton : null}
                </>;
    }
    
    private renderRow(row: IRow): JSX.Element {

        const removeBtnIconProps = { iconName: 'Delete' };
        let renderRemoveBtn =   <IconButton 
                                    iconProps={removeBtnIconProps}
                                    onClick={() => this.deleteItemRow(row.id)}
                                />;
        let isHorizontal = true;
        if (this.props.removeButtonPlacement === IconPlacement.Bottom) {
            isHorizontal = false;
            renderRemoveBtn =   <ActionButton 
                                    iconProps={removeBtnIconProps}
                                    onClick={() => this.deleteItemRow(row.id)}
                                >
                                    {this.props.removeButtonLabel}
                                </ActionButton>;
        }

        if (row.locked) {
            renderRemoveBtn =   <IconButton 
                                    iconProps={{iconName: 'Lock'}}
                                    disabled={true}
                                    styles={{
                                        root: {
                                            background: "transparent",
                                            selectors: {
                                                ':hover': {
                                                  background: "transparent",
                                                }
                                            }
                                        }
                                    }}
                                />;
        }

        return  <div key={row.id} style={{width: "100%"}}>
                    <Stack styles={stackItemStyles} tokens={{ childrenGap: !isHorizontal ? 12 : 'inherit'}} horizontal={isHorizontal} verticalAlign={isHorizontal ? "center" : "start"}>
                        <Stack.Item styles={{root: {width: "100%"}}}>
                            {row.renderItem(this.state.mountedRowIds.indexOf(row.id) !== -1)}
                        </Stack.Item>
                        <Stack.Item align="start">
                            {renderRemoveBtn}
                        </Stack.Item>
                    </Stack>
                    {this.props.separator && !isHorizontal ?
                        <Separator/> 
                        : null
                    }
                </div>;
    }

    public addItemRow(): void {

        const id = Guid.newGuid().toString();

        this.setState({
            rows: [
                ...this.state.rows,
                this.props.onRenderNewRow(id) // Give an unique ID for that row
            ]
        }, () => {
            if (this.props.onRowAdded) {
                this.props.onRowAdded(id);
            }
        });
    }

    public deleteItemRow(id: string): void {

        this.setState({
            rows: this.state.rows.filter(i => i.id !== id)
        }, () => {
            if (this.props.onRowDeleted) {
                this.props.onRowDeleted(id);
            }
        });        
    }

    private _getDragDropEvents(): IDragDropEvents {
        return {
          canDrop: (dropContext?: IDragDropContext, dragContext?: IDragDropContext) => {
            return true;
          },
          canDrag: (item?: IRow) => {
            return true;
          },
          onDrop: (item?: IRow, event?: DragEvent) => {
            if (this._draggedItem) {
              this._insertBeforeItem(item);
            }
          },
          onDragStart: (item?: IRow, itemIndex?: number) => {
            this._draggedItem = item;
            this._draggedIndex = itemIndex;
          },
          onDragEnd: (item?: IRow, event?: DragEvent) => {
            this._draggedItem = undefined;
            this._draggedIndex = -1;
          },
        };
    }

    private _insertBeforeItem(item: IRow): void {

        const draggedItems = this._selection.isIndexSelected(this._draggedIndex)
            ? (this._selection.getSelection() as IRow[])
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            : [this._draggedItem!];

        const insertIndex = this.state.rows.indexOf(item);
        const items = this.state.rows.filter(itm => draggedItems.indexOf(itm) === -1);

        items.splice(insertIndex, 0, ...draggedItems);

        this.setState({
            rows: items
        }, () => {
            if (this.props.onRowsOrderChanged) {
                this.props.onRowsOrderChanged(items);
            }
        });
    }
}