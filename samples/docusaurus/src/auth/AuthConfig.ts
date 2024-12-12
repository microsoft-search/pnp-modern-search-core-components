export const msalConfig = {
    auth: {
        clientId: process.env.ENV_MSSearchAppClientId,
        authority: `https://login.microsoftonline.com/${process.env.ENV_MSSearchAppTenantId}`,
        domainHint: process.env.ENV_MSSearchAppDomain,
        redirectUri: `${process.env.ENV_SiteUrl}`,
        postLogoutRedirectUri: '/'
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};