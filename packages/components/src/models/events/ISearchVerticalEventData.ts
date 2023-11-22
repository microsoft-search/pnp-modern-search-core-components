import { IDataVertical } from "../common/IDataVertical";
import { ComponentEventType } from "./EventType";

export class ISearchVerticalEventData {
    /**
     * Current selected vertical key
     */
    selectedVertical: IDataVertical;

    /**
     * Type of this event
     */
    eventType: ComponentEventType;
}