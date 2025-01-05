import { IRow, ItemRepeater } from "./ItemRepeater";

export enum IconPlacement {
    Right,
    Bottom
}

export interface IItemRepeaterSharedProps<T> {
    
    /**
     * The label to display for the the add new row button
     */
    addButtonLabel?: string;

    /**
     * The label to display on the remove button
     */
    removeButtonLabel?: string;

    /**
     * Indicating if adding new rows is disabled 
     */
    disabled?: boolean;

    /**
     * Add a separator between items. Only when removeButtonPlacement is "Bottom"
     */
    separator?: boolean;

    /**
     * Enable drag and drop on the repeater
     */
    enableDragDrop?: boolean;

    /**
     * The plcaement of the remove icon for the row (bottom or right)
     */
    removeButtonPlacement?: IconPlacement;

    /**
     * The inner ref to be abel to add/remove rows manually
     */
    innerRef?: React.LegacyRef<ItemRepeater<T>>;

    /**
     * Callback function to determine if the current item should be locked when the row is created (no deletion). By default, the item can be deleted
     * @param item the current item to process
     * @returns true if locked, false otherwise
     */
    isItemLocked?: (item: T) => boolean;
}

export interface IItemRepeaterProps<T> extends  IItemRepeaterSharedProps<T> {

    /**
     * The default rows to display
     */
    defaultRows?: IRow[];

    /**
     * Element to render when a new row is added
     */
    onRenderNewRow?(rowId: string): IRow;

    /**
     * Callback when a row is added
     * @param row the row id added
     */
    onRowAdded?(id: string): void;
    
    /**
     * Callback when a row is deleted
     * @param row the row id to delete
     */
    onRowDeleted?(id: string): void;

    /**
     * Callback handler when the rows order is updated. Index in the array represenst the new order
     * @param rows 
     */
    onRowsOrderChanged?(rows: IRow[]): void;
}