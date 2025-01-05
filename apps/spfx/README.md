# PnP Modern Search Core Components - SPFx WebParts

## Connection strategy

The connection synchronization process is managed directly by web components, waiting for each other at page load (10 s delay). It means you can set the components ids as attributes and let component manage.

Each component gets its corresponding dynamic data source reference in this format as the ID (`${this.manifest.componentType}.${this.manifest.id}.${this.instanceId}:${componentType}`;)

Ex: WebPart.6aa5f17d-c6f5-4853-8017-86ad27f396f1.8f28620f-75b7-453d-b96a-fcf85872634a:pnpModernSearchCoreResultsWebPar