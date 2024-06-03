export interface IFormBuilderState<T> {
   
    /**
     * Current form data
     */
    formData: T;
    
    /**
     * List of errors currently in the form
     */
    errors: Map<string,string>;
}