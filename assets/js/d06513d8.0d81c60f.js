"use strict";(self.webpackChunksearchdoc=self.webpackChunksearchdoc||[]).push([[3004],{7521:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>l});var t=r(4848),n=r(8453);const i={sidebar_position:5,toc_min_heading_level:2,toc_max_heading_level:5},o="Working with tokens",d={id:"sharepoint-webparts/available-webparts/working-with-tokens",title:"Working with tokens",description:"Tokens give you the ability to write dynamic search queries by using the special syntax .",source:"@site/docs/sharepoint-webparts/available-webparts/working-with-tokens.md",sourceDirName:"sharepoint-webparts/available-webparts",slug:"/sharepoint-webparts/available-webparts/working-with-tokens",permalink:"/pnp-modern-search-core-components/docs/sharepoint-webparts/available-webparts/working-with-tokens",draft:!1,unlisted:!1,editUrl:"https://github.com/microsoft-search/pnp-modern-search-core-components/tree/main/docs/sharepoint-webparts/available-webparts/working-with-tokens.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,toc_min_heading_level:2,toc_max_heading_level:5},sidebar:"mainSidebar",previous:{title:"Search Results",permalink:"/pnp-modern-search-core-components/docs/sharepoint-webparts/available-webparts/search-results"},next:{title:"Authoring templates",permalink:"/pnp-modern-search-core-components/docs/sharepoint-webparts/available-webparts/customize-templates"}},a={},l=[{value:"Page tokens",id:"page-tokens",level:2},{value:"Connections tokens",id:"connections-tokens",level:2},{value:"Context tokens",id:"context-tokens",level:2},{value:"Site, web, hub, etc. tokens",id:"site-web-hub-etc-tokens",level:2},{value:"User tokens",id:"user-tokens",level:2},{value:"Date tokens",id:"date-tokens",level:2},{value:"SharePoint search query variables",id:"sharepoint-search-query-variables",level:2},{value:"Supported variables",id:"supported-variables",level:3},{value:"Use the &#39;OR&#39; operator",id:"use-the-or-operator",level:3}];function c(e){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.h1,{id:"working-with-tokens",children:"Working with tokens"}),"\n",(0,t.jsxs)(s.p,{children:["Tokens give you the ability to write dynamic search queries by using the special syntax ",(0,t.jsx)(s.code,{children:"{TokenName}"}),"."]}),"\n",(0,t.jsx)(s.admonition,{type:"info",children:(0,t.jsx)(s.p,{children:"Tokens are case insensitive"})}),"\n",(0,t.jsx)(s.h2,{id:"page-tokens",children:"Page tokens"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Token"})}),(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Definition"})})]})}),(0,t.jsx)(s.tbody,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{Page.<FieldName>}"})}),(0,t.jsxs)(s.td,{children:['The value of a field on the page from where the query was issued. For example, if the page from where the query was issued contained a site column named "ContentOwner," specifying {Page.ContentOwner} would allow you to query for the value of "ContentOwner." FieldName is the internal name of the field. When used with taxonomy columns, use ',(0,t.jsx)(s.code,{children:"{Page.<FieldName>.Label}"})," or ",(0,t.jsx)(s.code,{children:"{Page.<FieldName>.TermID}"})]})]})})]}),"\n",(0,t.jsx)(s.h2,{id:"connections-tokens",children:"Connections tokens"}),"\n",(0,t.jsx)(s.p,{children:"Tokens related to connected Web Parts in the Search Results."}),"\n",(0,t.jsx)(s.admonition,{type:"info",children:(0,t.jsxs)(s.p,{children:["These tokens can be used in the 'PnP Modern Search Core Components Search Results' and 'PnP Modern Search Core Components Search Box' Web Parts.\nYou can escape curly braces characters using ",(0,t.jsx)(s.code,{children:"'\\'"})," to avoid: ex: ",(0,t.jsx)(s.code,{children:"DepartmentId:\\{edbfd618-ef1d-4cc5-a214-95bf44ddf4ee\\}"})]})}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Token"})}),(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Definition"})})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsxs)(s.strong,{children:["{inputQueryText} ",(0,t.jsx)("br",{}),"{searchTerms}"]}),(0,t.jsx)("br",{})]}),(0,t.jsxs)(s.td,{children:["The query value entered into a search box on a page. The value depends on the configuration of input text connection of the Search Results Web Part. ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{verticals.<value|name>}"})}),(0,t.jsx)(s.td,{children:"If connected, get the current selected vertical tab name or associated value."})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"context-tokens",children:"Context tokens"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Token"})}),(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Definition"})})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{PageContext.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current SPFx page context related tokens. You can use deep paths here to access properties. Ex: ",(0,t.jsx)(s.code,{children:"{PageContext.site.absoluteUrl}"}),". ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{LegacyPageContext.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current SPFx legacy page context related tokens. You can use deep paths here to access properties. Ex: ",(0,t.jsx)(s.code,{children:"{LegacyPageContext.aadTenantId}"}),". ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.strong,{children:"{QueryString.<ParameterName>}"})," ",(0,t.jsx)("br",{})]}),(0,t.jsxs)(s.td,{children:["A value from a query string in the URL of the current page. For example, if the URL of the current page contains a query string such as ItemNumber=567, you could obtain the value 567 by specifying ",(0,t.jsx)(s.code,{children:"{QueryString.ItemNumber}"}),". ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.strong,{children:"{CurrentDisplayLanguage}"})," ",(0,t.jsx)("br",{})]}),(0,t.jsxs)(s.td,{children:["The current display language based on MUI in ",(0,t.jsx)(s.em,{children:"ll-cc format"}),".  ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.strong,{children:"{CurrentDisplayLCID}"}),"  ",(0,t.jsx)("br",{})]}),(0,t.jsxs)(s.td,{children:["Numeric value of the current display language based on MUI in ",(0,t.jsx)(s.em,{children:"ll-cc format"}),".  ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.strong,{children:"{TenantUrl}"}),"  ",(0,t.jsx)("br",{})]}),(0,t.jsxs)(s.td,{children:["URL of the tenant (root site)",(0,t.jsx)("br",{})]})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"site-web-hub-etc-tokens",children:"Site, web, hub, etc. tokens"}),"\n",(0,t.jsxs)(s.p,{children:["Except for ",(0,t.jsx)(s.code,{children:"{Hub}"}),", these a shortands to the ",(0,t.jsx)(s.code,{children:"{PageContext}"})," tokens. They returns the same values. ",(0,t.jsx)(s.strong,{children:"<PropertyName>"})," is ",(0,t.jsx)(s.strong,{children:"case sensitive"}),"."]}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Token"})}),(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Definition"})})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{Site.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current site related tokens. You can use the 'Debug' layout and the ",(0,t.jsx)(s.code,{children:"context"})," property to see all available values for a site. Ex ",(0,t.jsx)(s.code,{children:"{Site.id._guid}"})," or ",(0,t.jsx)(s.code,{children:"{Site.absoluteUrl}"}),"."]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{Hub.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current hub site related tokens. Valid property names are ",(0,t.jsx)(s.code,{children:"{Hub.HubSiteId}"}),", ",(0,t.jsx)(s.code,{children:"{Hub.Id}"})," and ",(0,t.jsx)(s.code,{children:"{Hub.IsHubSite}"})," You can target a hub with the template: ",(0,t.jsx)(s.code,{children:"DepartmentId:\\{\\{Hub.HubSiteId\\}\\}"}),"."]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{Group.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current Office 365 group related tokens. You can use the 'Debug' layout and the ",(0,t.jsx)(s.code,{children:"context"})," property to see all available values for a site."]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{List.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current list related tokens. Ex ",(0,t.jsx)(s.code,{children:"{List.id._guid}"})," or ",(0,t.jsx)(s.code,{children:"{List.absoluteUrl}"}),"."]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{Web.<PropertyName>}"})}),(0,t.jsxs)(s.td,{children:["Resolves current web related tokens  You can use the 'Debug' layout and the ",(0,t.jsx)(s.code,{children:"context"})," property to see all available values for a site. Ex ",(0,t.jsx)(s.code,{children:"{Web.id._guid}"})," or ",(0,t.jsx)(s.code,{children:"{Web.absoluteUrl}"}),"."]})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"user-tokens",children:"User tokens"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Token"})}),(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Definition"})})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.strong,{children:"{User}"})," or ",(0,t.jsx)(s.strong,{children:"{User.Name}"})]}),(0,t.jsxs)(s.td,{children:["Display name of the user who issued the query. For example, this value can be used to query content of the managed property Author.  ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{User.Email}"})}),(0,t.jsxs)(s.td,{children:["Email address of the user who issued the query. For example, this value can be used to query content of the managed property WorkEmail.  ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{User.PreferredContentLanguage}"})}),(0,t.jsxs)(s.td,{children:["Language as specified as Preferred Content Language in the profile of the user who issued the query.  ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{User.PreferredDisplayLanguage}"})}),(0,t.jsxs)(s.td,{children:["Language as specified as Preferred Display Language in the profile of the user who issued the query.  ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{User.<property>}"})}),(0,t.jsxs)(s.td,{children:["Any property from the user profile of the user who issued the query \u2014 for example, ",(0,t.jsx)(s.code,{children:"SPS-Interests"}),", ",(0,t.jsx)(s.code,{children:"userprofile_guid"}),", ",(0,t.jsx)(s.code,{children:"accountname"}),", etc. including custom properties.  ",(0,t.jsx)("br",{})]})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"date-tokens",children:"Date tokens"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Token"})}),(0,t.jsx)(s.th,{children:(0,t.jsx)(s.strong,{children:"Definition"})})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{CurrentYear}"})}),(0,t.jsxs)(s.td,{children:["Todays's date four digits, 2018 ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{CurrentMonth}"})}),(0,t.jsxs)(s.td,{children:["Today's month, 1-12 ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.strong,{children:"{CurrentDate}"})}),(0,t.jsxs)(s.td,{children:["Today's date, 1-31 ",(0,t.jsx)("br",{})]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsxs)(s.td,{children:[(0,t.jsx)(s.strong,{children:"{Today+/- &lt;integer value for number of days>}"}),"  ",(0,t.jsx)("br",{})]}),(0,t.jsxs)(s.td,{children:["A date calculated by adding/subtracting the specified number of days to/from the date when the query is issued. Date format is YYYY-MM-DD (Ex: ",(0,t.jsx)(s.code,{children:"{Today+5}"}),") ",(0,t.jsx)("br",{})]})]})]})]}),"\n",(0,t.jsx)(s.h2,{id:"sharepoint-search-query-variables",children:"SharePoint search query variables"}),"\n",(0,t.jsx)(s.h3,{id:"supported-variables",children:"Supported variables"}),"\n",(0,t.jsxs)(s.p,{children:["The SharePoint Search engine already supports tokens by default (i.e query variables, ex: ",(0,t.jsx)(s.code,{children:"{Site.ID}"}),"). You can use them in the ",(0,t.jsx)(s.strong,{children:"Query template"})," field only. To see the all the supported tokens natively, refer to the ",(0,t.jsx)(s.a,{href:"https://docs.microsoft.com/en-us/sharepoint/technical-reference/query-variables",children:"Microsoft documentation"}),"."]}),"\n",(0,t.jsx)(s.h3,{id:"use-the-or-operator",children:"Use the 'OR' operator"}),"\n",(0,t.jsxs)(s.p,{children:["To deal with mutli valued properties (like taxonomy multi or choices SharePoint fields), you can use the 'OR' operator syntax ",(0,t.jsx)(s.code,{children:"{|<property><operator><multi_values_property>}"}),". The search query will be expanded to the following KQL query:"]}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.code,{children:"((<property><operator><value_1>) OR (<property><operator><value_2>) OR (<property><operator><value_3>) ...)"})}),"\n",(0,t.jsx)(s.p,{children:(0,t.jsx)(s.strong,{children:"Examples:"})}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Using an user profile multi values taxonomy property: ",(0,t.jsx)(s.code,{children:"{|owstaxidmetadataalltagsinfo:{User.SPS-Hashtags}}"})]}),"\n",(0,t.jsxs)(s.li,{children:["Using a page multi values taxonomy property: ",(0,t.jsx)(s.code,{children:"{|owstaxidmetadataalltagsinfo:{Page.myTaxonomyMultiColumn.TermID}}"})," or ",(0,t.jsx)(s.code,{children:"{|owstaxidmetadataalltagsinfo:{Page.myTaxonomyMultiColumn.Label}}"})]}),"\n",(0,t.jsxs)(s.li,{children:["Using a page multi values choice property: ",(0,t.jsx)(s.code,{children:"{|RefinableStringXX:{Page.myChoiceMultiColumn}}"})]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},8453:(e,s,r)=>{r.d(s,{R:()=>o,x:()=>d});var t=r(6540);const n={},i=t.createContext(n);function o(e){const s=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:o(e.components),t.createElement(i.Provider,{value:s},e.children)}}}]);