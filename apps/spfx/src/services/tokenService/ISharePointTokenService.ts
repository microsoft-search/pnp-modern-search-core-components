export interface ISharePointTokenService {

    /**
     * Retrieves available current page properties
     * @internal this method is not intended to be used directly in your code.
     */
    getPageProperties(): Promise<unknown>;

    /**
     * Retrieve all current user profile properties
     * @internal this method is not intended to be used directly in your code.
     */
    getUserProfileProperties(): Promise<IProfileProperties>;

    /**
     * Resolve tokens from input string
     * @param inputString the string to resolve
     */
    resolveTokens(inputString: string): Promise<string>;

}

export interface IProfileProperties {
    [propertyName: string]: string;
}
