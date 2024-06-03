export interface ITemplateContext {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layoutProperties: { [key: string]: any; }
    
    /**
     * Hashtable of configured slots for the current data source.
     */
    slots: { [key: string]: string };
}