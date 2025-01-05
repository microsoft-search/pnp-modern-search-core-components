---
sidebar_position: 1
---

# Solution overview

## Architecture


## Projects

The solution is a mono repository composed of these projects:

- `packages/components`: hosting code for reusable web components.
- `apps/spfx`: SharePoint Framework WebParts consuming web components from `packages/components`.
- `apps/teams`: Teams application consuming web components from `packages/components`.

## Contributing

This project follow the Gitflow development workflow. For more information see [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). 

It also uses GitVersion for versioning. See [Integrate with GitVersion](https://gitversion.net/docs/)

### Create an Entra ID application

To consume Microsoft Search data through Graph API, you will need first to create an Entra ID application with one or more following scopes depending the [entity types you use](https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0#scope-search-based-on-entity-types). For example:

- `Acronym.Read.All`
- `Bookmark.Read.All`
- `ExternalItem.Read.All`
- `Files.Read.All`
- `People.Read.All`
- `QnA.Read.All`
- `Site.Read.All`
- `User.Read`

### Get the solution locally

1. Clone the repository from [GitHub](https://github.com/microsoft-search/pnp-modern-search-core-components)

1. In the the project root folder, install dependencies using `pnpm i`. We use [`pnpm` workspaces](https://pnpm.io/workspaces) and [`lerna`](https://lerna.js.org/) behind the scenes to manage depedencies correctly for all projects.
1. Build all projects using `npx lerna run build`
