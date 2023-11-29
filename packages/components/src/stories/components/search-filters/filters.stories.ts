import { Story, Meta } from "@storybook/web-components";
import { html } from "lit";
import { ComponentElements } from "../../../common/Constants";
import { withAuth } from "../../../../.storybook/addons/authAddon";
import { SearchFiltersComponent } from "../../../components/search-filters/SearchFiltersComponent";
import { BasicQueryStory } from "../search-results/query.stories";
import { aggregatedFilterConfiguration, baseFilterConfiguration } from "../../../components/search-filters/sub-components/filters/checkbox-filter/tests/mocks";
import { rest } from "msw";

// Required web component definitions
import "../../../exports/define/pnp-search-filters";
import "../../../exports/define/pnp-search-results";

import { ifDefined } from "lit/directives/if-defined.js";
import { CommonArgTypes, CommonArgs, CommonParameters } from "../common";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { mockedMicrosoftSearchResponse } from "../../../../.storybook/mocks/mocks";

export default {
    title: "Components / Search / Search filters",
    component: ComponentElements.SearchFiltersComponent,
    decorators: [withAuth]
} as Meta<SearchFiltersComponent>;

// #region Templates
const BasicFiltersTemplate = (args) => {
  
  // Simulates a login to trigger the `loadState()` method
  Providers?.globalProvider?.login();

  return html`

    <pnp-search-filters 
        id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
        search-results-ids=${args["search-results-ids"]}
        operator="and"
        settings=${JSON.stringify(args.settings)}
        theme=${args["theme"]}
    >
    </pnp-search-filters>

    <pnp-search-results
        id="b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"
        class="p-8"
        query-text=${args["query-text"]} 
        entity-types=${args["entity-types"]} 
        fields=${args.fields.join(",")} 
        page-size=${args["page-size"]}
        query-template=${ifDefined(args["query-template"] ? args["query-template"] : undefined)}
        search-filters-id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
        search-sort-id="99d3e914-2c8e-4f42-897e-53bb4d960e94"
        sort-properties='[{"sortField":"LastModifiedTime","sortDirection":"desc","isDefaultSort":false,"isUserSort":true,"sortFieldDisplayName":{"fr-fr":"Date de modification","default":"Last modified"}}]'
        theme=${args["theme"]}
    >
    </pnp-search-results>
  `;
};

//#region Basic filters
export const BasicFiltersStory: Story = BasicFiltersTemplate.bind({});
BasicFiltersStory.storyName = "Basic usage";
BasicFiltersStory.args = {
  ...CommonArgs,
  ...BasicQueryStory.args,
  "search-results-ids": ["b359f3dc-6b6a-4575-90ed-e5942bcbb8a6"],
  "settings": [baseFilterConfiguration],
};
BasicFiltersStory.argTypes = {
  ...CommonArgTypes,
  ...BasicQueryStory.argTypes
};
BasicFiltersStory.parameters = { 
    controls: { 
      include: [
        ...CommonParameters,
        "search-results-ids",
        "settings"
      ] 
    },
    msw: [
      rest.post("https://graph.microsoft.com/v1.0/search/query", (_req, res, ctx) => {
        return res(ctx.delay(500), ctx.json(mockedMicrosoftSearchResponse));
      }),
    ]
};
//#endregion

//#region Aggregations
aggregatedFilterConfiguration.aggregations[0].aggregationValueIconUrl = "./word.svg";

export const AggregationsStory: Story = BasicFiltersTemplate.bind({});
AggregationsStory.storyName = "Aggregations";
AggregationsStory.args = { 
  ...BasicFiltersStory.args,
  "query-template": "{searchTerms} FileType:docx OR FileType:doc OR FileType:docm",
  "settings": [aggregatedFilterConfiguration],
};
AggregationsStory.argTypes ={
  ...BasicFiltersStory.argTypes
};
AggregationsStory.parameters = BasicFiltersStory.parameters;
//#endregion