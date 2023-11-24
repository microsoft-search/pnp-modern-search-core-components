import { Story, Meta } from "@storybook/web-components";
import { html } from "lit";
import { ComponentElements } from "../../../../src/common/Constants";
import { withAuth } from "../../../../.storybook/addons/authAddon";
import { ifDefined } from "lit/directives/if-defined.js";
import { EntityType } from "@microsoft/microsoft-graph-types";
import { rest } from "msw";

// Required web component definitions
import "../../../exports/define/pnp-adaptive-card";
import "../../../exports/define/pnp-search-results";
import { CommonArgTypes, CommonArgs, CommonParameters } from "../common";
import { mockedMicrosoftSearchResponse } from "../../../../.storybook/mocks/mocks";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
    title: "Components / Search / Search results",
    component: ComponentElements.SearchResultsComponent,
    decorators: [withAuth]
} as Meta;

// #region Templates
const BasicQueryTemplate = (args) => {

  Providers?.globalProvider?.login();

  return html`
    <pnp-search-results
      class="p-8"
      query-text=${args["query-text"]} 
      entity-types=${args["entity-types"]} 
      fields=${args.fields.join(",")} 
      page-size=${args["page-size"]}
      ?enable-result-types=${args["enable-result-types"]}
      connections=${ifDefined(args.connections ? args.connections : undefined)}
      theme=${args["theme"]}
    >
    </pnp-search-results>
  `;
};

const AdvancedQueryTemplate = (args) => {
  
  Providers?.globalProvider?.login();

  return html`
            <pnp-search-results
              class="p-8"
              query-text=${args["query-text"]} 
              query-template=${args["query-template"]}
              ?use-beta=${args["use-beta"]}
              default-query-string-parameter=${args["default-query-string-parameter"]}
              entity-types=${args["entity-types"]} 
              fields=${args.fields.join(",")} 
              page-size=${args["page-size"]}
              sort-properties=${JSON.stringify(args["sort-properties"])}
            >
            </pnp-search-results>
  `;
};
//#endregion

const responseHandlerV1 = rest.post("https://graph.microsoft.com/v1.0/search/query", (_req, res, ctx) => {
    return res(ctx.delay(500), ctx.json(mockedMicrosoftSearchResponse));
});

const responseHandlerBeta = rest.post("https://graph.microsoft.com/beta/search/query", (_req, res, ctx) => {
    return res(ctx.delay(500), ctx.json(mockedMicrosoftSearchResponse));
});

//#region Basic usage
export const BasicQueryStory: Story = BasicQueryTemplate.bind({});
BasicQueryStory.storyName = "Basic usage";
BasicQueryStory.args = { 
  ...CommonArgs,
  "query-text": "*", 
  "entity-types": ["listItem"] as EntityType[],
  "fields": ["name","title","created","createdBy","filetype","lastModifiedTime","modifiedBy","defaultEncodingURL","hitHighlightedSummary","SPSiteURL","SiteTitle"],
  "page-size": 5
};
BasicQueryStory.argTypes = {
  ...CommonArgTypes,
  "query-text": { control: "text" },
  "page-size": { control: { type: "range", min: 1, max: 50, step: 1 } }
};
BasicQueryStory.parameters = { 
  controls: { 
    include: [
      ...CommonParameters,
      "query-text",
      "entity-types",
      "fields",
      "page-size"
    ] 
  },
  msw: [responseHandlerV1]
};
//#endregion

//#region Advanced query
export const AdvancedQueryStory: Story = AdvancedQueryTemplate.bind({});
AdvancedQueryStory.storyName = "Advanced query";
AdvancedQueryStory.args = { 
  ...BasicQueryStory.args,
  "sort-properties": [{name: "LastModifiedTime", isDescending: true}],
  "use-beta": true,
  "default-query-string-parameter": "q",
  "query-template": "{searchTerms} FileType:pdf"
};
AdvancedQueryStory.argTypes = {
  ...BasicQueryStory.argTypes,
  "use-beta": { control: "boolean" },
  "default-query-string-parameter": { control: "text" },
  "query-template": { control: "text" },
};
AdvancedQueryStory.parameters = {
  controls: { 
    include: [
      ...BasicQueryStory.parameters.controls.include,
      "default-query-string-parameter",
      "sort-properties",
      "use-beta",
      "query-template"
    ]
  },
  msw: [responseHandlerV1,responseHandlerBeta]
};
//#endregion

//#region Result types
export const ResultTypeQueryStory: Story = BasicQueryTemplate.bind({});
ResultTypeQueryStory.storyName = "Result types";
ResultTypeQueryStory.args = { 
  ...BasicQueryStory.args,
  ["entity-types"]: ["externalItem"],
  "enable-result-types": true
};
ResultTypeQueryStory.argTypes = {
  ...BasicQueryStory.argTypes,
  "enable-result-types": { control: "boolean" }
};
ResultTypeQueryStory.parameters = {
  controls: { 
    include: [
      ...BasicQueryStory.parameters.controls.include,
      "connections",
      "enable-result-types"
    ]
  },
  msw: [responseHandlerV1]
};
//#endregion