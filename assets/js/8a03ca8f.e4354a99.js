"use strict";(self.webpackChunksearchdoc=self.webpackChunksearchdoc||[]).push([[803],{4131:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var r=n(4848),t=n(8453);const o={sidebar_position:1},i="Installation",a={id:"sharepoint-webparts/add-webparts",title:"Installation",description:"1. Download the latest SharePoint Framework packages pnp-modern-search-core-spfx.sppkg from the GitHub repository.",source:"@site/docs/sharepoint-webparts/add-webparts.mdx",sourceDirName:"sharepoint-webparts",slug:"/sharepoint-webparts/add-webparts",permalink:"/pnp-modern-search-core-components/docs/sharepoint-webparts/add-webparts",draft:!1,unlisted:!1,editUrl:"https://github.com/microsoft-search/pnp-modern-search-core-components/tree/main/docs/sharepoint-webparts/add-webparts.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"mainSidebar",previous:{title:"SharePoint Web Parts",permalink:"/pnp-modern-search-core-components/docs/category/sharepoint-web-parts"},next:{title:"Configure Webparts",permalink:"/pnp-modern-search-core-components/docs/category/configure-webparts"}},c={},d=[{value:"Approving Scopes",id:"approving-scopes",level:2},{value:"Add Web Parts to your site",id:"add-web-parts-to-your-site",level:2}];function l(e){const s={a:"a",admonition:"admonition",blockquote:"blockquote",em:"em",h1:"h1",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.h1,{id:"installation",children:"Installation"}),"\n",(0,r.jsxs)(s.ol,{children:["\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:["Download the latest SharePoint Framework packages ",(0,r.jsx)(s.strong,{children:"pnp-modern-search-core-spfx.sppkg"})," from the ",(0,r.jsx)(s.a,{href:"https://github.com/microsoft-search/pnp-modern-search-core-components/releases",children:"GitHub repository"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(s.li,{children:["\n",(0,r.jsxs)(s.p,{children:["Add ",(0,r.jsx)(s.strong,{children:"pnp-modern-search-core-spfx.sppkg"})," to the global tenant app catalog or a site collection app catalog. If you don't have an app catalog, follow this ",(0,r.jsx)(s.a,{href:"https://docs.microsoft.com/en-us/sharepoint/use-app-catalog",children:"procedure"})," to create one."]}),"\n",(0,r.jsx)("div",{className:"center"}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:["The packages are deployed in the general Microsoft 365 CDN meaning ",(0,r.jsx)(s.strong,{children:"we don't host any code"}),"."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:["For the ",(0,r.jsx)(s.strong,{children:"pnp-modern-search-core-spfx.sppkg"})," package, you can choose to make the solution available in ",(0,r.jsx)(s.a,{href:"https://docs.microsoft.com/en-us/sharepoint/dev/spfx/tenant-scoped-deployment",children:"all sites"})," or force to install an app to the site every time."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:["The solution asks the following API permissions by default to enhance the experience. These permissions are ",(0,r.jsx)(s.strong,{children:"not mandatory"}),". If you don't accept them, you will simply have less available features."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:["You can approve scopes from the API Access screen in the SharePoint Admin Center: ",(0,r.jsx)(s.strong,{children:"https://<tenant>-admin.sharepoint.com/_layouts/15/online/AdminHome.aspx#/webApiPermissionManagement"})," If you'd like more details on this step, please see the ",(0,r.jsx)(s.a,{href:"#approving-scopes",children:"Approving Scopes"})," section below."]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{children:"Requested API permission"}),(0,r.jsx)(s.th,{children:"Used for"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"User.Read"})}),(0,r.jsxs)(s.td,{children:["The Microsoft Graph Toolkit ",(0,r.jsx)(s.a,{href:"https://docs.microsoft.com/en-us/graph/toolkit/components/person-card#microsoft-graph-permissions",children:"persona card"})," in the people layout."]})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"People.Read"})}),(0,r.jsx)(s.td,{children:"Same as above."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Contacts.Read"})}),(0,r.jsx)(s.td,{children:"Same as above."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"User.Read.All"})}),(0,r.jsx)(s.td,{children:"Same as above."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Files.Read.All"})}),(0,r.jsx)(s.td,{children:"Allow search for files using Graph API (Drive / Drive Items)."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Mail.Read"})}),(0,r.jsx)(s.td,{children:"Allow search for user's e-mail using Graph API (Messages)."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Calendars.Read"})}),(0,r.jsx)(s.td,{children:"Allow search for user's calendar appointments using Graph API (Events)."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Sites.Read.All"})}),(0,r.jsx)(s.td,{children:"Allow search for sites using Graph API (Sites / List Items)."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"ExternalItem.Read.All"})}),(0,r.jsx)(s.td,{children:"Allow search for connector items using Graph API (External Items)."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Bookmark.Read.All"})}),(0,r.jsx)(s.td,{children:"Allow search for Bookmarks in Microsoft Search in your organization."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Acronym.Read.All"})}),(0,r.jsx)(s.td,{children:"Allow search for Acronyms in Microsoft Search in your organization."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"Chat.Read"})}),(0,r.jsx)(s.td,{children:"Allow search for Teams messages."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.em,{children:"ChannelMessage.Read.All"})}),(0,r.jsx)(s.td,{children:"Same as above."})]})]})]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(s.h2,{id:"approving-scopes",children:"Approving Scopes"}),"\n",(0,r.jsx)(s.p,{children:"You can approve the required scopes in the SharePoint Admin Center on the API Access page. When you visit that page, you will see any pending requests. The screenshot below shows the pending requests for the v4 solution."}),"\n",(0,r.jsxs)(s.p,{children:["You'll need to approve each request one at a time. If you have questions about what the requested scopes mean and what permissions they provide, check the article ",(0,r.jsx)(s.a,{href:"https://docs.microsoft.com/en-us/sharepoint/api-access",children:"Manage access to Azure AD-secured APIs"}),"."]}),"\n",(0,r.jsx)(s.p,{children:"After you approve each request your view will be as shown in the screenshot below."}),"\n",(0,r.jsx)(s.h2,{id:"add-web-parts-to-your-site",children:"Add Web Parts to your site"}),"\n",(0,r.jsxs)(s.p,{children:["To add them on a SharePoint page, edit the page page and search for ",(0,r.jsx)(s.em,{children:'"PnP Modern Search Core Components"'}),":"]}),"\n",(0,r.jsx)("div",{className:"center",children:(0,r.jsx)(s.p,{children:(0,r.jsx)(s.img,{alt:"Add WebParts",src:n(8156).A+"",width:"526",height:"340"})})}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsx)(s.p,{children:"SharePoint Web Parts are meant for end-users to integrate them in their SharePoint pages."})}),"\n",(0,r.jsx)(s.admonition,{type:"note",children:(0,r.jsxs)(s.p,{children:["\u26a0\ufe0f",(0,r.jsx)(s.strong,{children:"PnP Modern Search Core Components Web Parts"})," are different from ",(0,r.jsx)(s.strong,{children:(0,r.jsx)(s.a,{href:"https://microsoft-search.github.io/pnp-modern-search/",children:"PnP Modern Search"})})," regular Web Parts"]})})]})}function h(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8156:(e,s,n)=>{n.d(s,{A:()=>r});const r=n.p+"assets/images/add_webparts-4df6969b66b269324b2430ee5efff4d9.png"},8453:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>a});var r=n(6540);const t={},o=r.createContext(t);function i(e){const s=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),r.createElement(o.Provider,{value:s},e.children)}}}]);