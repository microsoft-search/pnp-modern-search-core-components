
import { customElementHelper } from "@microsoft/mgt-element/dist/es6/components/customElementHelper";
import "../exports/define/pnp-adaptive-card";
import "../exports/define/pnp-language-provider";
import "../exports/define/pnp-search-filters";
import "../exports/define/pnp-search-infos";
import "../exports/define/pnp-search-input";
import "../exports/define/pnp-search-results";
import "../exports/define/pnp-search-verticals";
import "../exports/define/pnp-video-player";

// To be able to use MGT components in host application and templates
customElementHelper.withDisambiguation("pnp");
import("@microsoft/mgt");