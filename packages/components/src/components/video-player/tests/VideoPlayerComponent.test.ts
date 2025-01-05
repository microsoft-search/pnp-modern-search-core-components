import { assert, elementUpdated, fixture, html } from "@open-wc/testing";
import sinon from "sinon";
import { VideoPlayerComponent } from "../VideoPlayerComponent";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { TestsHelper } from "../../../helpers/TestsHelper";

import "../../../exports/define/pnp-video-player";
import { UrlHelper } from "../../../helpers/UrlHelper";
import isEqual from "lodash-es/isEqual";

//#region Selectors
const getPlayButton = (component: VideoPlayerComponent) => component?.shadowRoot?.querySelector<HTMLElement>("[data-ref='play-button'");
const getVideoIFrame = (component: VideoPlayerComponent) => component?.shadowRoot?.querySelector<HTMLIFrameElement>("iframe");
//#endregion

//#region Stubs
const stubPreviewUrl = (component: VideoPlayerComponent, previewUrl) => {
    const previewUrlStub = sinon.stub(component, "getVideoPreviewUrl");
    previewUrlStub.returns(Promise.resolve(previewUrl));
    return previewUrlStub;
};

const stubVideoTitle = (component: VideoPlayerComponent, title) => {
    const videoTitleStub = sinon.stub(component, "getVideoTitle");
    videoTitleStub.returns(Promise.resolve(title));
    return videoTitleStub;
};

const stubThumbnailUrl = (component: VideoPlayerComponent, thumbnailUrl) => {
    const thumbnailUrlStub = sinon.stub(component, "getVideoThumbnailUrl");
    thumbnailUrlStub.returns(Promise.resolve(thumbnailUrl));
    return thumbnailUrlStub;
};
//#endregion

//#region Constants
const videoUrl = "https://contoso.sharepoint.com/:v:/r/sites/FakeSite/Shared%20Documents/Videos/FakeVideo.mp4";
const previewUrl = "https://contoso.sharepoint.com/sites/FakeSite/Shared%20Documents/Videos/FakeVideo.mp4";
const thumbnailUrl = "https://contoso.sharepoint.com/sites/FakeSite/Shared%20Documents/Videos/FakeVideo.png";
//#endregion

describe("pnp-video-player", () => {

    beforeEach(() => {
        Providers.globalProvider = TestsHelper.getTestProvider();
    });

    afterEach(async () => {
        await Providers?.globalProvider?.logout();
    });

    describe("common", () => {

        it("should be defined", async () => {
            const el = document.createElement("pnp-video-player");
            assert.instanceOf(el, VideoPlayerComponent);
        });
    });

    describe("lazy loading", () => {

        it("should only display the iframe when the play button is clicked when lazy loading is enabled", async () => {
            
            const el: VideoPlayerComponent = await fixture(html`<pnp-video-player 
                                                                            lazy-loading
                                                                            video-url=${videoUrl}></pnp-video-player>`);
            stubPreviewUrl(el, previewUrl);
            stubVideoTitle(el, "Fake Title");
            stubThumbnailUrl(el, thumbnailUrl);

            // Simulates a login to trigger the `loadState()` method
            await Providers?.globalProvider?.login();
           el.requestUpdate();
            await elementUpdated(el);

            assert.isNotNull(getPlayButton(el));
            assert.isNull(getVideoIFrame(el));

            getPlayButton(el)?.click();
           el.requestUpdate();
            await elementUpdated(el);
            
            assert.isNull(getPlayButton(el));
            assert.isNotNull(getVideoIFrame(el));

            // Autoplay should be enable in the URL
            const embed = UrlHelper.getQueryStringParam("embed", getVideoIFrame(el)?.src as string);
            assert.equal(isEqual(JSON.parse(decodeURIComponent(embed)), {"af":true,"ust":true}), true);
        });

        it ("should load the video directly if lazy loading if not enabled", async () => {

            const el: VideoPlayerComponent = await fixture(html`<pnp-video-player
                                                                            video-url=${videoUrl}></pnp-video-player>`);
            
            stubPreviewUrl(el, previewUrl);
            stubVideoTitle(el, "Fake Title");
            stubThumbnailUrl(el, thumbnailUrl);

            // Simulates a login to trigger the `loadState()` method
            await Providers?.globalProvider?.login();
           el.requestUpdate();
            await elementUpdated(el);

            assert.isNotNull(getVideoIFrame(el));
            assert.isNull(getPlayButton(el));
        });
    });

    describe("no video fetching", () => {


        it("should not fetch video details if preview url and or thumbnail url are set", async () => {

            const el: VideoPlayerComponent = await fixture(
                html`<pnp-video-player
                        preview-url=${previewUrl}></pnp-video-player>
                `
            );

            const previewStub = stubPreviewUrl(el, previewUrl);
            const videoStub = stubVideoTitle(el, "Fake Title");
            const thumbnailStub = stubThumbnailUrl(el, thumbnailUrl);

            // Simulates a login to trigger the `loadState()` method
            await Providers?.globalProvider?.login();
           el.requestUpdate();
            await elementUpdated(el);
            
            assert.equal(previewStub.callCount, 0);
            assert.equal(videoStub.callCount, 0);
            assert.equal(thumbnailStub.callCount, 0);

            assert.equal(getVideoIFrame(el)?.src, previewUrl);        
        });
    });
});