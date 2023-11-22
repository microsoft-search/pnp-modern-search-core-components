export interface ITemplateContext {

    /**
     * Hashtable of configured slots for the current data source.
     */
    slots: { [key: string]: string };
}