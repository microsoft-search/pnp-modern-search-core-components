The solution uses the following technologies

| Solution part | Technology/Tool | Comments |
| ------------- | --------------- | -------- |
| **Components code and logic** | [Web Component](https://developer.mozilla.org/en-US/docs/web/web_components) -> [Lit Element](https://lit.dev/docs/) -> [Microsoft Graph Toolkit](https://learn.microsoft.com/en-us/graph/toolkit/overview) -> Custom components. | All components basically extend the `MgtTemplatedComponent` base class from `@microsoft/mgt-element` library.
| **Components internal styling** | [TailwindCSS](https://tailwindcss.com/) | Allow to quickly style components without having to maintain dedicated stylesheets. A must have!
| **Components build** | [Webpack 5](https://webpack.js.org/) | Allow to precisely define the output we want to be able to distribute the components. Also comes with a dev server allowing local debug and tests (ex: `index.html`).
| **Test framework** | [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/#web-test-runner) with [Playwright](https://playwright.dev/) | Configuration use ESBuild, Mocha, Chai and Sinon for tests.
| **Components demo and live documentation** | [Storybook](https://storybook.js.org/docs/web-components/get-started/install/)  | Components attributes/proeprties documentation is generated automatically from the code comments through []`custom-elements.json`](https://storybook.js.org/docs/web-components/api/argtypes#automatic-argtype-inference) file. Storybook is configured to run with Webpack 5.
| **Static documentation** | [MKdocs](https://www.mkdocs.org/) and Horizon platform | Technical static documentation is only accessible internally (unlike components documentation).

### Why using Microsoft Graph Toolkit instead of regular web components?

Microsoft Graph Toolkit provides several advantages to create reusable components:

- Comes with an authentication providers mechanim making it easy for components to consume Azure AD protected APIs, especially Graph API.
- Comes with a localization support.
- Comes with a `template` support with a data binding syntax as a convenient wrapper over web components [default slot mechanism](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots).
- Simple/flexible enough to be extended with the `@microsoft/mgt-element` base classes.