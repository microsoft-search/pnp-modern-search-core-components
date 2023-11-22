import { Story, Meta } from "@storybook/web-components";
import { html } from "lit";
import { ComponentElements } from "../../../common/Constants";
import { withAuth } from "../../../../.storybook/addons/authAddon";
import { rest } from "msw";

import { baseVerticalSettings } from "../../../components/search-verticals/tests/mocks";

import "../../../exports/define/pnp-search-verticals";
import "../../../exports/define/pnp-search-results";
import { CommonArgTypes, CommonArgs, CommonParameters } from "../common";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { mockedMicrosoftSearchResponse } from "../../../../.storybook/mocks/mocks";

export default {
    title: "Components / Search / Search verticals",
    component: ComponentElements.SearchVerticalsComponent,
    decorators: [withAuth]
} as Meta;

// #region Templates
const BasicUsageTemplate = (args) => {
  
  Providers?.globalProvider?.login();

  return  html`
            <pnp-search-verticals 
                id="0fa619a7-442a-4255-8fca-f3ce36a01518"
                .verticals=${args.settings}
                theme=${args["theme"]}
            >
            </pnp-search-verticals>

            <pnp-search-results 
              query-text="*"
              page-size="1"
              comp-title="Displayed on tab 1"
              search-verticals-id="0fa619a7-442a-4255-8fca-f3ce36a01518"
              .selectedVerticalKeys=${["tab1"]}
              theme=${args["theme"]}
            >
            </pnp-search-results>

            <pnp-search-results 
              query-text="*"
              page-size="1"
              comp-title="Displayed on tab 2"
              search-verticals-id="0fa619a7-442a-4255-8fca-f3ce36a01518"
              .selectedVerticalKeys=${["tab2"]}
              theme=${args["theme"]}
            >
            </pnp-search-results>
          `;
};
// #endregion

const responseHandlerV1 = rest.post("https://graph.microsoft.com/v1.0/search/query", (_req, res, ctx) => {
    return res(ctx.delay(500), ctx.json(mockedMicrosoftSearchResponse));
});

//#region Basic usage
export const BasicUsageStory: Story = BasicUsageTemplate.bind({});
BasicUsageStory.storyName = "Basic usage";
BasicUsageStory.args = {
  ...CommonArgs,
  settings: baseVerticalSettings
};
BasicUsageStory.argTypes = {
  ...CommonArgTypes
};
BasicUsageStory.parameters = {
    controls: { 
      include: [
        ...CommonParameters,
        "settings"
      ]
    },
    msw: [responseHandlerV1]
};
// #endregion