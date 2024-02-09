export interface IBaseWebComponentWrapperProps {

    /**
     * Unique id of the component (same as dynamic data source referemce)
     */
    id: string;

    /**
     * Theme to use for the component
     */
    theme: string;

    /**
     * Enables the debug mode on component
     */
    enableDebugMode: boolean;

    /**
     * Enable the Microsoft Graph Toolkit for templates
     */
    useMicrosoftGraphToolkit: boolean;

    /**
     * The web HTML template content
     */
    templateContent?: string;
}