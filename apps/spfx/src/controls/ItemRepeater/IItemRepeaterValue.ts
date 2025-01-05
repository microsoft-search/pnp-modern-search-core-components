/**
 * Represents an item with value of type T to repeat.
 * Use this interface to track changes on data when rows are added or deleted 
 */
export interface IItemRepeaterValue<T> {
    id: string;
    value: T;
}