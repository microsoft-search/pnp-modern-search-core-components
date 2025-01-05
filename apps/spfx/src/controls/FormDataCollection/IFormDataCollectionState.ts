import { IItemRepeaterValue } from "../ItemRepeater/IItemRepeaterValue";
import { IRow } from "../ItemRepeater/ItemRepeater";

export interface IFormDataCollectionState<T> {
    values: IItemRepeaterValue<T>[];
    defaultRows: IRow[];
}