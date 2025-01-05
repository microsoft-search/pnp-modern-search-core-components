import { assert } from "@open-wc/testing";

import "../../../exports/define/pnp-adaptive-card";
import { AdaptiveCardComponent } from "../AdaptiveCardComponent";

describe("pnp-adaptive-card ", async () => {

    describe("common", () => {

        it("should be defined", () => {
            const el = document.createElement("pnp-adaptive-card");
            assert.instanceOf(el, AdaptiveCardComponent);
        });

    });
});
