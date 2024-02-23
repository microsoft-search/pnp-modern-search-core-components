"use strict";(self.webpackChunksearchdoc=self.webpackChunksearchdoc||[]).push([[588],{3253:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>d});var n=o(4848),s=o(8453);const r={sidebar_position:1},i="Solution overview",c={id:"web-components/development/solution",title:"Solution overview",description:"Technologies",source:"@site/docs/web-components/development/solution.md",sourceDirName:"web-components/development",slug:"/web-components/development/solution",permalink:"/pnp-modern-search-core-components/docs/web-components/development/solution",draft:!1,unlisted:!1,editUrl:"https://github.com/microsoft-search/pnp-modern-search-core-components/tree/main/docs/web-components/development/solution.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"mainSidebar",previous:{title:"Development guide",permalink:"/pnp-modern-search-core-components/docs/category/development-guide"},next:{title:"Getting started",permalink:"/pnp-modern-search-core-components/docs/web-components/development/getting_started"}},l={},d=[{value:"Technologies",id:"technologies",level:2},{value:"Why using Microsoft Graph Toolkit instead of regular web components?",id:"why-using-microsoft-graph-toolkit-instead-of-regular-web-components",level:2}];function a(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"solution-overview",children:"Solution overview"}),"\n",(0,n.jsx)(t.h2,{id:"technologies",children:"Technologies"}),"\n",(0,n.jsx)(t.p,{children:"The solution uses the following technologies"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{children:"Solution part"}),(0,n.jsx)(t.th,{children:"Technology/Tool"}),(0,n.jsx)(t.th,{children:"Comments"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.strong,{children:"Components code and logic"})}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"https://developer.mozilla.org/en-US/docs/web/web_components",children:"Web Component"})," -> ",(0,n.jsx)(t.a,{href:"https://lit.dev/docs/",children:"Lit Element"})," -> ",(0,n.jsx)(t.a,{href:"https://learn.microsoft.com/en-us/graph/toolkit/overview",children:"Microsoft Graph Toolkit"})," -> Custom components."]}),(0,n.jsxs)(t.td,{children:["All components basically extend the ",(0,n.jsx)(t.code,{children:"MgtTemplatedTaskComponent"})," base class from ",(0,n.jsx)(t.code,{children:"@microsoft/mgt-element"})," library."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.strong,{children:"Components internal styling"})}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.a,{href:"https://tailwindcss.com/",children:"TailwindCSS"})}),(0,n.jsx)(t.td,{children:"Allow to quickly style components without having to maintain dedicated stylesheets. A must have!"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.strong,{children:"Components build"})}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.a,{href:"https://webpack.js.org/",children:"Webpack 5"})}),(0,n.jsxs)(t.td,{children:["Allow to precisely define the output we want to be able to distribute the components. Also comes with a dev server allowing local debug and tests (ex: ",(0,n.jsx)(t.code,{children:"index.html"}),")."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.strong,{children:"Test framework"})}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"https://modern-web.dev/docs/test-runner/overview/#web-test-runner",children:"Web Test Runner"})," with ",(0,n.jsx)(t.a,{href:"https://pptr.dev/",children:"Pupeeter"})]}),(0,n.jsx)(t.td,{children:"Configuration use ESBuild, Mocha, Chai and Sinon for tests."})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.strong,{children:"Components demo and live documentation"})}),(0,n.jsx)(t.td,{children:(0,n.jsx)(t.a,{href:"https://storybook.js.org/docs/web-components/get-started/install/",children:"Storybook"})}),(0,n.jsxs)(t.td,{children:["Components attributes/properties documentation is generated automatically from the code comments through ",(0,n.jsx)(t.a,{href:"https://storybook.js.org/docs/web-components/api/argtypes#automatic-argtype-inference",children:(0,n.jsx)(t.code,{children:"custom-elements.json"})})," file. Storybook is configured to run with Webpack 5 (with no Babel compiler)."]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:(0,n.jsx)(t.strong,{children:"Static documentation"})}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.a,{href:"https://docusaurus.io/docs",children:"Docusaurus"})," and GitHub Pages"]}),(0,n.jsx)(t.td,{children:"Online documentation."})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"why-using-microsoft-graph-toolkit-instead-of-regular-web-components",children:"Why using Microsoft Graph Toolkit instead of regular web components?"}),"\n",(0,n.jsx)(t.p,{children:"Microsoft Graph Toolkit provides several advantages to create reusable components:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Comes with an authentication providers mechanim making it easy for components to consume Azure AD protected APIs, especially Graph API."}),"\n",(0,n.jsx)(t.li,{children:"Comes with a localization support."}),"\n",(0,n.jsxs)(t.li,{children:["Comes with a ",(0,n.jsx)(t.code,{children:"template"})," support with a data binding syntax as a convenient wrapper over web components ",(0,n.jsx)(t.a,{href:"https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots",children:"default slot mechanism"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["Simple/flexible enough to be extended with the ",(0,n.jsx)(t.code,{children:"@microsoft/mgt-element"})," base classes."]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},8453:(e,t,o)=>{o.d(t,{R:()=>i,x:()=>c});var n=o(6540);const s={},r=n.createContext(s);function i(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);