import { registerMgtMockProvider, registerMgtMsal2Provider, registerMgtProxyProvider } from "@microsoft/mgt";

import "../exports/define/pnp-adaptive-card";
import "../exports/define/pnp-language-provider";
import "../exports/define/pnp-search-filters";
import "../exports/define/pnp-search-infos";
import "../exports/define/pnp-search-input";
import "../exports/define/pnp-search-results";
import "../exports/define/pnp-search-verticals";
import "../exports/define/pnp-video-player";

// Register MGT providers on the page
registerMgtMsal2Provider();
registerMgtProxyProvider();
registerMgtMockProvider();