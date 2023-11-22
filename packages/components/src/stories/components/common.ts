import { ArgTypes, Args } from "@storybook/web-components";

export const CommonArgs: Partial<Args> = {
    "theme": "default"
};

export const CommonArgTypes: Partial<ArgTypes<Args>> = {
    "theme" :{
        options: ["default", "dark"],
        control: { type: "inline-radio" }
    }
};

export const CommonParameters = [
    "theme"
];