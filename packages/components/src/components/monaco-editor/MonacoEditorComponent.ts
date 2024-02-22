import { CSSResultGroup, LitElement, PropertyValues, html } from "lit";
import { property } from "lit/decorators.js";
import { BaseComponent } from "../BaseComponent";
import { IDataSourceData } from "../../models/common/IDataSourceData";
import loader from "@monaco-editor/loader";
import { type editor } from "monaco-editor";

export class MonacoEditorComponent extends LitElement {

    @property({type: String, attribute: "theme", reflect: true})
    theme;

    @property()
    value: IDataSourceData;

    declare editor: editor.IStandaloneCodeEditor;

    constructor() {
        super();

        loader.config({ paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.41.0/min/vs"
        }});

        this.editor = null;
        this.createEditor = this.createEditor.bind(this);
    }

   /**
     * Returns Tailwind CSS base styles
     */
    static override get styles(): CSSResultGroup {

        return [
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }

    protected override render(): unknown {
        const renderContainer =  html`<div id="container" class="h-full"></div>`;
        return renderContainer;
    }

    override async connectedCallback(): Promise<void> {
        return super.connectedCallback();
    }

    private async createEditor() {

        const container = (this.renderRoot as HTMLElement).querySelector("#container");
        
        const monaco = await loader.init();

        // Copy over editor styles as they are not shared with web component
        const styles = document.querySelectorAll(
            "link[rel='stylesheet'][data-name^='vs/']"
        );
        for (const style of styles) {
            this.renderRoot.appendChild(style.cloneNode(true));
        }

        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true
        });

        this.editor = monaco.editor.create(container as HTMLElement, {
            value: JSON.stringify({...this.value}, undefined, 4),
            language: "json",
            wordWrap: "wordWrapColumn",
            wrappingIndent: "indent",
            automaticLayout: true,
            folding: true,
            scrollbar: {
                useShadows: false,
                verticalHasArrows: true,
                horizontalHasArrows: true,
                vertical: "visible",
                horizontal: "visible",
                verticalScrollbarSize: 17,
                horizontalScrollbarSize: 17,
                arrowSize: 30,
            },
            theme: this.theme === "dark" ? "vs-dark" : "vs",
            readOnly: true,
            lineNumbers: "on",
            minimap: {
                enabled: true,
            }
        });

        await this.editor.getAction("editor.foldLevel3").run();
   
        return;
    }

    protected override async updated(changedProperties: PropertyValues<this>): Promise<void> {
       
        if (changedProperties.has("value")) {

            if (!this.editor) {
                await this.createEditor();
            }

            this.editor.setValue(JSON.stringify(this.value, undefined, 4));             
            await this.editor.getAction("editor.foldLevel3").run();
        }
    }
}