import { Story, Meta } from "@storybook/web-components";
import { html } from "lit";
import { ComponentElements } from "../../../common/Constants";
import { withAuth } from "../../../../.storybook/addons/authAddon";

import "../../../exports/define/pnp-search-input";

import { ifDefined } from "lit/directives/if-defined.js";
import { CommonArgTypes, CommonArgs, CommonParameters } from "../common";

export default {
    title: "Components / Search / Search box",
    component: ComponentElements.SearchInputComponent,
    decorators: [withAuth]
} as Meta;

// #region Templates
const BasicUsageTemplate = (args) => html`

    <pnp-search-input
        id="edfdea93-23c9-4ba6-94d9-a848a1384104"
        placeholder=${args.placeholder}
        default-query-string-parameter=${ifDefined(args["default-query-string-parameter"] ? args["default-query-string-parameter"] : undefined)}
        theme=${args["theme"]}
    >
    </pnp-search-input>
`;
// #endregion

// #region Templates
const RedirectUrlTemplate = (args) => html`
    <pnp-search-input
        id="edfdea93-23c9-4ba6-94d9-a848a1384104"
        placeholder=${args.placeholder}
        search-in-new-page=${args["search-in-new-page"]}
        search-page-url=${args["search-page-url"]}
        query-behavior=${args["query-behavior"]}
        query-parameter=${args["query-parameter"]}
        open-behavior=${args["open-behavior"]}
    >
    </pnp-search-input>
`;
// #endregion

//#region Basic usage
export const BasicUsageStory: Story = BasicUsageTemplate.bind({});
BasicUsageStory.storyName = "Basic usage";
BasicUsageStory.args = {
    placeholder: "Enter a keyword...",
    "default-query-string-parameter": "q",
    ...CommonArgs
};
BasicUsageStory.argTypes = {
    placeholder: { control: "text" },
    "default-query-string-parameter": { control: "text" },
   ...CommonArgTypes
};
BasicUsageStory.parameters = {
    controls: { 
      include: [
        "placeholder",
        "default-query-string-parameter",
        ...CommonParameters
      ]
    }
};
// #endregion

//#region Redirect URL
export const RedirectUrlStory: Story = RedirectUrlTemplate.bind({});
RedirectUrlStory.storyName = "Redirect to URL";
RedirectUrlStory.args = {
    ...BasicUsageStory.args,
    "search-in-new-page": true,
    "search-page-url": `${window.location.protocol}//${window.location.host}/?path=/story/components-search-search-box--basic-usage-story`,
    "query-behavior":"queryparameter",
    "query-parameter": "q",
    "open-behavior": "newTab"
};
RedirectUrlStory.argTypes = {
    ...BasicUsageStory.argTypes,
    "search-in-new-page": { control: "boolean" },
    "search-page-url": { control: "text" },
    "query-behavior": { control: "select", options: ["queryparameter","fragment"] },
    "query-parameter": { control: "text" },
    "open-behavior":   { control: "select", options: ["self","newTab"] }
};
RedirectUrlStory.parameters = {
    controls: { 
        include: [
            "placeholder",
            "search-in-new-page",
            "search-page-url",
            "query-behavior",
            "query-parameter",
            "open-behavior"
        ]
    }
};
// #endregion