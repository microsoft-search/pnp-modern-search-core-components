/**
 * List of available slot values for Handlebars templates
 */
export enum BuiltinTemplateSlots {
    Title = "Title",
    Path = "Path",
    Summary = "Summary",
    FileType = "FileType"
}

export enum SlotType {
    DynamicField = 'dynamicfield',
    RawValue = 'rawvalue'
}

export interface ILayoutSlot {

    /**
     * Name of the slot to be used in the Handlebars templates (ex: 'Title'). This will be accessible using \{{@slots.<name>}} in templates
     */
    slotName: BuiltinTemplateSlots | string;

    /**
     * The source field associated with that slot
     */
    slotValue: string;

    /**
     * The slot type (dynamic field vs static value)
     */
    slotType: SlotType;

    /**
     * If the slot name can be edited
     */
    disabled?: boolean;
}
