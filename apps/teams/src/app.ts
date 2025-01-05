import { app as msTeams } from "@microsoft/teams-js";
import "@pnp/modern-search-core/dist/es6/bundle";
import { IProviderAccount, LanguageProvider, Providers, TeamsFxProvider } from "../../../packages/components/dist/es6/exports";
import { TeamsUserCredential } from "@microsoft/teamsfx";


export class TeamsProvider extends TeamsFxProvider {

    private accounts: IProviderAccount[] = [];

    constructor(user: msTeams.UserInfo, credential: TeamsUserCredential, scopes: string[]) {

        super(credential, scopes);
        this.accounts = [
            {
                id: user?.id,
                name: user?.displayName,
                mail: user?.userPrincipalName,
                tenantId: user?.tenant?.id
            }
        ];
    }

    override getAllAccounts(): IProviderAccount[] {
        return this.accounts;
    }
}

const appInitialize = async () => {
    
  // Retrieve parameters from URL (see manifest.json->contentSourceUrl for the query string parameters)
  const searchParams = new URLSearchParams(window.location.search);
  const locale = searchParams.get("locale")
    ? searchParams.get("locale")
    : localStorage.getItem("locale");
  const theme = searchParams.get("theme")
    ? searchParams.get("theme")
    : localStorage.getItem("theme");
  const userInfo: msTeams.UserInfo = {
    id: searchParams.get("user_id")
      ? searchParams.get("user_id")
      : localStorage.getItem("user_id"),
    userPrincipalName: searchParams.get("user_upn")
      ? searchParams.get("user_upn")
      : localStorage.getItem("user_upn"),
    tenant: {
      id: searchParams.get("tenant")
        ? searchParams.get("tenant")
        : localStorage.getItem("tenant"),
    },
  };

  // Set configuration values in local storage for search page
  localStorage.setItem("locale", locale);
  localStorage.setItem("theme", theme);
  localStorage.setItem("user_id", userInfo.id);
  localStorage.setItem("user_upn", userInfo.userPrincipalName);
  localStorage.setItem("tenant", userInfo.tenant.id);

  // Language support
  const languageProvider = new LanguageProvider();
  languageProvider.setLanguage(locale);

  // Dark theme support
  if (theme === "dark" || theme === "contrast") {
    // Automatically add the "dark" CSS class to trigger dark mode on components (via Tailwind CSS)
    document.body.classList.add("dark");

    document.body.style.setProperty("--ubi365-iconColor", "#FFF");
    document.body.style.setProperty("--ubi365-iconTextColor", "#000");
  } else {
    document.body.style.setProperty("--ubi365-iconColor", "#000");
    document.body.style.setProperty("--ubi365-iconTextColor", "#FFF");
  }

  // Comes from the Webpack Environment Plugin
  const graphScopes = JSON.parse(process.env.ENV_MSSearchAppScopes);
  const clientId = process.env.ENV_MSSearchAppClientId;

  const authConfig = {
    clientId: clientId,
    initiateLoginEndpoint: "auth-start.html",
  };

  const teamsUserCredential = new TeamsUserCredential(authConfig);

  const provider = new TeamsProvider(
    userInfo,
    teamsUserCredential,
    graphScopes
  );


  Providers.globalProvider = provider;

  await provider.login();
};

appInitialize();
