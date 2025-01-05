import { ILayoutSlot } from "../../models/common/ILayoutSlot";

export interface ILayoutSlotFieldProps {
    defaultValue: ILayoutSlot;
    onChange: (slot: ILayoutSlot) => void
    dynamicValues: string[];
}