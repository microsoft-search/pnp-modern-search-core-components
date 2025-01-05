import { IRow } from "./ItemRepeater";

export interface IItemRepeaterState {
    rows: IRow[];
    mountedRowIds: string[];
}