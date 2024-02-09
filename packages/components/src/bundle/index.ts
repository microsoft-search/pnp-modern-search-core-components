import { registerMgtComponents, registerMgtMsal2Provider } from "@microsoft/mgt";

import "../exports/define/pnp-adaptive-card";
import "../exports/define/pnp-language-provider";
import "../exports/define/pnp-search-filters";
import "../exports/define/pnp-search-infos";
import "../exports/define/pnp-search-input";
import "../exports/define/pnp-search-results";
import "../exports/define/pnp-search-verticals";
import "../exports/define/pnp-video-player";

registerMgtComponents();
registerMgtMsal2Provider();