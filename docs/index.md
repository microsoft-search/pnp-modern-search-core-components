# PnP Modern Search - Core Components

!!! information
    These components have been initially made by [Ubisoft](https://www.ubisoft.com/) as part of their Microsoft Search implementation. They've been adapted are given to the community for free. A big thanks to them! Sharing is caring.

    !["Ubisoft"](./assets/ubisoft_stacked_logo_black.png){: .center .logo}

    <p align="center">
      The complete use case can be downloaded here
      <a href="./assets/ubisoft_microsoft-search-implementation_use_case.pdf" target="_blank"><img src="./assets/read_btn.svg"/></a>
   </p> 


The goal is to provide reusable components based on Microsoft Search and Microsoft Graph in general that can be used transversally in an organization.

> Despite we provide a SharePoint WebParts implementation over these components, this **is not a new version, nor a replacement** of the [PnP Modern Search WebParts](https://github.com/microsoft-search/pnp-modern-search). The main difference is they can be used outside SharePoint to leverage Microsoft Graph and Microsoft Search.

## What are they?

These components are regular [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) built on top of [Microsoft Graph Toolkit](https://learn.microsoft.com/en-us/graph/toolkit/overview) and [Lit elements](https://lit.dev/docs/).

## What components are included?

The following components are included in the bundle:

| Component | HTML tag | Purpose |
| --------- | -------- | ------- |
| [Search results]() | `<pnp-search-results>` | Display results from Microsoft Search index according to configured parameters. |
| [Search filters]() | `<pnp-search-filters>` | Display filters from a connected search results components |
| [Search box]() | `<pnp-search-input>` | Allow users to enter free text search keywords.
| [Search verticals]() | `<pnp-search-verticals>`  | Displays tabs to search by verticals |
| [Video player]() | `<pnp-video-player>`  | Play video from SharePoint (outside of SharePoint domain) |


##  How I get started?

To get started, simply follow the [guide](./development/getting_started.md)!

Thank you to all [Ubisoft members who participate to this project](./thanks.md)!

## Want to see them in action?

You can play with components in the [playground](https://azpnpmodernsearchcoresto.z9.web.core.windows.net/latest/index.html?path=/docs/introduction-getting-started--docs)