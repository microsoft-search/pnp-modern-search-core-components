export class TemplateHelper {

    /**
     * Normalizes an HTML template by fixing wrong constructed document fragment
     * @param template the HTML template to normalize
     * @returns the normalized template as HTML string
     */
    public static normalizeHtmlTemplate(template: HTMLTemplateElement): string {
         
        if (template.childNodes.length > 0 && template.content.childNodes.length === 0) {
            const documentFragment = document.createDocumentFragment();
            for (let i = 0; i < template.childNodes.length; i++) {
                const node = template.childNodes[i].cloneNode(true);
                documentFragment.appendChild(node);
            }
        
            template.content.appendChild(documentFragment);
        }

        return template.outerHTML;
    }
}