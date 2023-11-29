import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { BaseComponent } from "../BaseComponent";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { IProvider, ProviderState } from "@microsoft/mgt-element/dist/es6/providers/IProvider";
import { ErrorMessageComponent } from "../search-results/sub-components/error-message/ErrorMessageComponent";

export class VideoPlayerComponent extends BaseComponent {

    /**
     * Title of the video for ARIA screen readers
     */
    @property({type: String, attribute: "title"})
    videoTitle: string;

    /***
     * Url from Microsoft SharePoint
     */
    @property({type: String, attribute: "video-url"})
    videoUrl: string;

    /**
     * Thumbnail URl to use. Only used when 'lazy-loading' is set to true.
     * If 'video-url' is set, this thumbnail will be used.
     */
    @property({type: String, attribute: "thumbnail-url"})
    thumbnailUrl: string;

    /**
     * Width of the player. If not set, follow width of the parent
     */
    @property({type: String, attribute: "width"})
    width: string;

    /**
     * Height of the player. If not set, follow height of the parent
     */
    @property({type: String, attribute: "height"})
    height: string;

    /**
     * Flag indicating if the video should start automatically. 
     * ATTENTION: May be blocked by browser evn if true
     */
    @property({type: Boolean, attribute: "autoplay"})
    autoplay: boolean;

    /**
     * Allows fullscreen on the video
     */
    @property({type: Boolean, attribute: "allowfullscreen"})
    allowfullscreen: boolean;

    /**
     * The video preview URL to use in the iframe. This URL must be accessible by the current user. 
     */
    @property({type: String, attribute: "preview-url"})
    previewUrl: string;

    /**
     * If set to 'true', the component won't load the iframe until a click on a fake play button is performed by the user + the video thumbnail will be displayed
     * When clicked, the iframew is loaded and the video launches in autoplay mode.
     */
    @property({type: Boolean, attribute: "lazy-loading"})
    lazyLoading: boolean;

    @state()
    renderIFrame: boolean;

    @state()
    override error: Error = null;
    
    static override get scopedElements() { 
        return {
            ...super.scopedElements,
            "pnp-error-message": ErrorMessageComponent
        }; 
    }

    constructor() {
        super();
        this.handlePlayBtnClick = this.handlePlayBtnClick.bind(this);
    }

    protected override render() {

        const height = this.height ? this.height : "100%";
        const width = this.width ? this.width : "100%";

        let thumbnailUrlStyles = null;
        let renderIframe = null;
        let renderPlayButton = null;

        // Render error
        if (this.error) {

            return  html`
                        <div data-ref="thumbnail-container" style="${thumbnailUrlStyles} height:${height}; width:${width}">
                            <pnp-error-message .error=${this.error}></pnp-error-message>    
                        </div>
                    `;
        }

        if (this.thumbnailUrl) {
            thumbnailUrlStyles = `background-image: url(${this.thumbnailUrl});`;
        }

        if (this.previewUrl && (this.renderIFrame || !this.lazyLoading)) {
            renderIframe =  html`
                                <iframe 
                                    class='rounded-lg' 
                                    height="${height}"
                                    width=${width}
                                    title=${this.videoTitle}
                                    src='${`${this.previewUrl}${this.autoplay || this.lazyLoading ? `&embed=${JSON.stringify({"af":true,"ust":true})}` : ""}`}' 
                                    frameborder='0'
                                    scrolling='no' 
                                    ?allowfullscreen=${this.allowfullscreen}>
                                </iframe>
                            `;
        }
        
        if (this.lazyLoading && !this.renderIFrame) {

            renderPlayButton =  html`
                                    <div
                                        style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                                        <div data-ref="play-button" @click=${this.handlePlayBtnClick}>
                                            <svg class="icon" width="36px" height="36px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
                                            <style type="text/css">
                                                .st0{fill:#FFFFFF;}
                                            </style>
                                            <g>
                                                <path class="st0" d="M20,0c-4,0-7.8,1.2-11.1,3.4c-3.3,2.2-5.9,5.3-7.4,9C0,16-0.4,20,0.4,23.9c0.8,3.9,2.7,7.4,5.5,10.2
                                                    c2.8,2.8,6.4,4.7,10.2,5.5S24,40,27.7,38.5c3.7-1.5,6.8-4.1,9-7.4C38.8,27.8,40,24,40,20c0-5.3-2.1-10.4-5.9-14.1
                                                    C30.4,2.1,25.3,0,20,0z M27,21.3l-9.2,6.2c-0.2,0.2-0.5,0.2-0.8,0.3c-0.3,0-0.6,0-0.8-0.2c-0.2-0.1-0.5-0.3-0.6-0.6
                                                    c-0.1-0.2-0.2-0.5-0.2-0.8V13.8c0-0.3,0.1-0.6,0.2-0.8c0.1-0.2,0.3-0.4,0.6-0.6c0.2-0.1,0.5-0.2,0.8-0.2c0.3,0,0.5,0.1,0.8,0.3
                                                    l9.2,6.2c0.2,0.1,0.4,0.3,0.5,0.6c0.1,0.2,0.2,0.5,0.2,0.7s-0.1,0.5-0.2,0.7C27.4,20.9,27.2,21.1,27,21.3z"/>
                                            </g>
                                            </svg>
                                        </div>
                                    </div>              
                                `;
        }
        
        return  html`
                    <div data-ref="thumbnail-container" style="${thumbnailUrlStyles} height:${height}; width:${width}" 
                        class="relative rounded-lg flex bg-cover bg-center">
                            ${renderPlayButton}
                            ${renderIframe}
                    </div>          
                `;
    }

    public override connectedCallback(): Promise<void> {
        return super.connectedCallback();
    }

    protected override async loadState(): Promise<void> {
        
        const provider = Providers.globalProvider;
        if (!provider || provider.state !== ProviderState.SignedIn) {
            return;
        }

        if (this.videoUrl) {

            const base64string = `u!${window.btoa(this.videoUrl).replace(/\//gi,"_").replace(/\+/gi,"-").replace(/=/gi,"")}`;
            const graphBaseUrl = `https://graph.microsoft.com/v1.0/shares/${base64string}/driveItem`;

            // Get title
            this.videoTitle = await this.getVideoTitle(provider, graphBaseUrl);

            // Get preview URL
            this.previewUrl = await this.getVideoPreviewUrl(provider, graphBaseUrl);
            
            // Get thumbnailUrl if needed
            if (this.lazyLoading && !this.thumbnailUrl) {
                this.thumbnailUrl = await this.getVideoThumbnailUrl(provider, graphBaseUrl);
            }
        }
    }

    public async getVideoTitle(provider: IProvider, graphBaseUrl: string): Promise<string> {

        try {
        const response = await provider.graph.api(`${graphBaseUrl}/name`).headers({
            "SdkVersion": "PnPModernSearchCoreComponents",
            "Content-Type": "application/json"
        }).get();

        return response.value;

        } catch (error) {
            this.error = error;
        }
    }

    public async getVideoPreviewUrl(provider: IProvider, graphBaseUrl: string): Promise<string> {

        try {
            const response = await provider.graph.api(`${graphBaseUrl}/preview`).headers({
                "SdkVersion": "PnPModernSearchCoreComponents",
                "Content-Type": "application/json"
            }).post({});

            return response.getUrl;

        } catch (error) {
            this.error = error;
        }
    }

    public async getVideoThumbnailUrl(provider: IProvider, graphBaseUrl: string): Promise<string> {

        try {
            const response = await provider.graph.api(`${graphBaseUrl}/thumbnails/0/large/url`).headers({
                "SdkVersion": "PnPModernSearchCoreComponents",
                "Content-Type": "application/json"
            }).post({});

            return response.value;

        } catch (error) {
            this.error = error;
        }
    }

    private handlePlayBtnClick() {
        this.renderIFrame = true;
    }

    static override get styles() {
        return [
            css`
                :host  {
                    .icon:hover {
                        cursor: pointer;  
                        filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.5));
                    }

                    .icon {
                        filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.2));
                    }
                } 
            `,
            BaseComponent.themeStyles, // Allow component to use theme CSS variables from design. The component is a first level component so it is OK to define them variables here
            BaseComponent.styles // Use base styles (i.e. Tailwind CSS classes)
        ];
    }
}