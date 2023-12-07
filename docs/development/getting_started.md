## Getting started

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) with the following recommended extensions installed:
    - [Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep)
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
    - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
    - [PowerShell 7](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)
    - [MDX](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
- [MkDocs](https://www.mkdocs.org/user-guide/installation/)
- [Node.js]() v16.19.1 or higher


### Create Azure AD application




### Get the solution locally

1. Clone the repository from [GitHub](https://github.com/microsoft-search/pnp-modern-search-core-components)

1. In the the project root folder, install dependencies using `pnpm i`. We use [`pnpm` workspaces](https://pnpm.io/workspaces) and [`lerna`](https://lerna.js.org/) behind the scenes to manage depedencies correctly for all projects.
1. Build all projects using `npx lerna run build`

### Web components

#### Run and debug the solution

1. Open the project root folder in Visual Studio Code.
1. From the _'Terminal'_ window, run the following command:

    `npx lerna run serve --scope=pnp-modern-search-core`

    This will bundle the solution and serve it from a local server on adresss [http://localhost:8080/index.html](http://localhost:8080/index.html):

    !["index.html"](../assets/localhost_index.png)

!!! warning "Use **index.html** as your sandbox"
    The `packages/components/dev/index.html` is a sandbox page, meaning you can update it any way you want to test components behavior. To know all available parameters for components, go to the "playground".

1. To debug the components, start debugging using the **"Local debug (Edge|Chrome)"** configuration:

    !["Local debug"](../assets/local_debug.png)

#### Run and debug tests

1. Open the `packages/components` folder in Visual Studio Code.
1. From the 'Terminal', run the following command:

    `pnpm run test:watch`

    This will start tests in watch mode on the `http://localhost:8000/`. Choose then the test you want to debug:

    !["Test selection"](../assets/test_selection.png)

    !!! notice
        To run all tests (ex: before a commit), run `npx lerna run test --scope=pnp-modern-search-core`:
        !["Run all tests"](../assets/run_all_tests.png)

1. Launch the **"Debug tests Edge"** VSCode configuration and choose the test you want to debug:

    !["Debug tests"](../assets/debug_tests.png)

1. Put breakpoints in your tests and refresh the page to trigger the test again:

    !["Debug tests breakpoints"](../assets/debug_tests_breakpoints.png)

### Run Storybook stories 

We use Storybook to demo components in different scenarios:

!["Storybook"](../assets/storybook.png)

To run Storybook locally run the following command:

`npx lerna run docs:watch --scope=pnp-modern-search-core`   

!!! notice
    All stories are read from the `packages/components/src/stories` folder.

### SPFx Web Parts

#### Run and debug the solution

1. Open the project root folder in Visual Studio Code.
1. From the 'Terminal', run the following command:

    `npx lerna run serve --scope=pnp-modern-search-core-spfx`

1. You can also go directly to ``packages/spfx` and run `npm run serve`.
1. Open the **Hosted workbench** debug configuration and add WebParts from Local category:

    !["Hosted workbench"](../assets/hosted_workbench.png)


!!! notice
    If you need to work on both web components and Web Parts at the same time, you can run the following commands
    
    1. From `packages/components`, run `pnpm run build:watch` 
    1. From `pacakges/spfx`, run `npm run serve`

### Run the MkDocs documentation

1. Open the project root folder in Visual Studio Code.
1. From the 'Terminal', run the following command:

    `pip install pygments toc pymdown-extensions markdown_include`

    `python -m mkdocs serve`
