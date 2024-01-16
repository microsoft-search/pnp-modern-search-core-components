import { Meta, Story } from "@storybook/web-components";
import { html } from "lit";
import { ComponentElements } from "../../../common/Constants";
import { SearchResultsComponent } from "../../../components/search-results/SearchResultsComponent";
import { withAuth } from "../../../../.storybook/addons/authAddon";
import { BasicQueryStory } from "./query.stories";
import { rest } from "msw";

// Required web component definitions
import "../../../exports/define/pnp-adaptive-card";
import "../../../exports/define/pnp-search-results";
import { Providers } from "@microsoft/mgt-element/dist/es6/providers/Providers";
import { mockedMicrosoftSearchResponse } from "../../../../.storybook/mocks/mocks";

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
    title: "Components / Search / Search results",
    component: ComponentElements.SearchResultsComponent,
    decorators: [withAuth]
} as Meta<SearchResultsComponent>;

// #region Templates
const CustomItemsTemplate = (args) => {
    
    Providers?.globalProvider?.login();
    
    return html`
        <pnp-search-results
            class="p-8"
            query-text=${args["query-text"]} 
            entity-types=${args["entity-types"]} 
            fields=${args.fields.join(",")} 
            page-size=${args["page-size"]}
            theme=${args["theme"]}
        >
        <template data-type="items">

        <div data-for='item in items'>
            <div class="pb-8">
                <div class="flex space-x-2 mb-2">
                    <a href="{{item.resource.fields.defaultEncodingURL}}">
                        <div class="font-bold">{{item.resource.name}}</div>
                    </a>
                    <div class="h-6">By {{item.resource.createdBy.user.displayName}}</div>
                </div>
            </div>
        </div>

        </template>

        <template data-type="shimmers">
            <div data-for='i in items'>

                <div class="animate-shimmer pb-8">
                    <div class="flex space-x-2 mb-2 ">
                        <div class="w-6 h-6 rounded bg-slate-200"></div>
                        <div class="w-96 h-6 rounded bg-slate-200"></div>
                    </div>
                </div>

            </div>
        </template>
    </pnp-search-results>`;
};

const CustomHeaderTemplate = (args) => {

    Providers?.globalProvider?.login();
    
    return html`
            <pnp-search-results
                class="p-8" 
                query-text=${args["query-text"]} 
                entity-types=${args["entity-types"]} 
                fields=${args.fields.join(",")} 
                page-size=${args["page-size"]}
                see-all-link=${args["see-all-link"]}
                comp-title=${args["comp-title"]}
                ?show-count=${args["show-count"]}
                theme=${args["theme"]}
            >
            </pnp-search-results>
        `;
};

const PagingTemplate = (args) => {

    Providers?.globalProvider?.login();

    return html`
            <pnp-search-results
                class="p-8" 
                query-text=${args["query-text"]} 
                entity-types=${args["entity-types"]} 
                fields=${args.fields.join(",")} 
                page-size=${args["page-size"]}
                pages-number=${args["pages-number"]}
                ?show-paging=${args["show-paging"]}
                theme=${args["theme"]}
            >
            </pnp-search-results>
        `;
};

//#endregion

const responseHandlerV1 = rest.post("https://graph.microsoft.com/v1.0/search/query", (_req, res, ctx) => {
    return res(ctx.delay(500), ctx.json(mockedMicrosoftSearchResponse));
});

//#region 'items' + 'shimmers' template
export const CustomItemsTemplateStory: Story = CustomItemsTemplate.bind({});
CustomItemsTemplateStory.storyName = "Custom templates";
CustomItemsTemplateStory.args = {
    ...BasicQueryStory.args
};
CustomItemsTemplateStory.argTypes = {
    ...BasicQueryStory.argTypes
};
CustomItemsTemplateStory.parameters = {
    controls: { 
      include: [
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...BasicQueryStory.parameters?.controls?.include,
      ]
    },
    msw: [responseHandlerV1]
};
//#endregion

//#region Custom header
export const CustomHeaderTemplateStory: Story = CustomHeaderTemplate.bind({});
CustomHeaderTemplateStory.storyName = "Custom header";
CustomHeaderTemplateStory.args = { 
    ...BasicQueryStory.args,
    "query-text": "*",
    "see-all-link": "http://mysearchapp?k={searchTerms}",
    "comp-title": "My results",
    "show-count": true
};
CustomHeaderTemplateStory.argTypes = {
    ...BasicQueryStory.argTypes,
    "show-count": { control: "boolean" },
    "see-all-link": { control: "text" },
    "comp-title": { control: "text" },
};
CustomHeaderTemplateStory.parameters = {
    controls: { 
      include: [
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...BasicQueryStory.parameters?.controls?.include,
        "see-all-link",
        "comp-title",
        "show-count"
      ]
    },
    msw: [responseHandlerV1]
};
//#endregion

//#region Paging
export const PagingTemplateStory = PagingTemplate.bind({});
PagingTemplateStory.storyName = "Paging options";
PagingTemplateStory.args = { 
    ...BasicQueryStory.args,
    "pages-number": 5,
    "show-paging": true
};
PagingTemplateStory.argTypes = {
    ...BasicQueryStory.argTypes,
    "show-paging": { control: "boolean" },
};
PagingTemplateStory.parameters = {
    controls: { 
      include: [
        // eslint-disable-next-line no-unsafe-optional-chaining
        ...BasicQueryStory.parameters?.controls?.include,
        "pages-number",
        "show-paging"
      ]
    },
    msw: [responseHandlerV1]
};
//#endregion