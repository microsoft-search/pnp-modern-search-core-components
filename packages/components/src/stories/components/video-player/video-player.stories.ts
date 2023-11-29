import { Story, Meta } from "@storybook/web-components";
import { html } from "lit";
import { ComponentElements } from "../../../common/Constants";
import { withAuth } from "../../../../.storybook/addons/authAddon";

import "../../../exports/define/pnp-video-player";
import { mockedMicrosoftSearchVideoResponse } from "../../../../.storybook/mocks/mocks";
import { rest } from "msw";

export default {
    title: "Components / Misc / Video player",
    component: ComponentElements.VideoPlayerComponent,
    decorators: [withAuth]
} as Meta;

// #region Templates
const BasicUsageTemplate = (args) => html`
    <pnp-video-player
        title=${args.title}
        video-url=${args["video-url"]}
        preview-url=${args["preview-url"]}
        thumbnail-url=${args["thumbnail-url"]}
        width=${args.width}
        height=${args.height}
        ?autoplay=${args.autoplay}
        ?allowfullscreen=${args.allowfullscreen}
        ?lazyLoading=${args["lazy-loading"]}
    >
    </pnp-video-player>
`;
// #endregion

const responseHandlerV1 = rest.post("https://graph.microsoft.com/v1.0/search/query", (_req, res, ctx) => {
    return res(ctx.delay(500), ctx.json(mockedMicrosoftSearchVideoResponse));
});

//#region Basic usage
export const BasicUsageStory: Story = BasicUsageTemplate.bind({});
BasicUsageStory.storyName = "Basic usage";
BasicUsageStory.args = {
    "video-url": "https://yourtenant.sharepoint.com/:v:/r/sites/contoso/Shared%20Documents/Videos/dummy.webm?csf=1&web=1&e=3OCUl1",
    title: "",
    width: "100%",
    height : "100%",
    "preview-url": "",
    "lazy-loading": false,
    allowfullscreen: true,
    autoplay: false,
    "thumbnail-url": ""
};
BasicUsageStory.argTypes = {
    title: { control: "text" },
    "video-url": { control: "text" },
    width: { control: "text" },
    height : { control: "text" },
    previewUrl: { control: "text" },
    lazyLoading:  { control: "boolean" },
    allowfullscreen: { control: "boolean" },
    autoplay: { control: "boolean" },
    thumbnailUrl: { control: "text" },
};
BasicUsageStory.parameters = {
    controls: { 
      include: [
        "title",
        "video-url",
        "thumbnail-url",
        "width",
        "height",
        "autoplay",
        "allowfullscreen",
        "preview-url",
        "lazy-loading",
      ]
    },
    msw: [responseHandlerV1]
};
// #endregion