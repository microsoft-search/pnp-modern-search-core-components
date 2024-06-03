import { app as msTeams } from "@microsoft/teams-js";
import  "@pnp/modern-search-core/dist/es6/bundle";
import { IProviderAccount, Providers, TeamsFxProvider } from "../../../packages/components/dist/es6/exports";
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
    
    if (!msTeams.isInitialized()) {
        await msTeams.initialize();
    } 

    const { app, user } = await msTeams.getContext();

    // Dark theme support
    if (app?.theme === "dark" || app?.theme === "contrast") {
        // Automatically add the "dark" CSS class to trigger dark mode on components (via Tailwind CSS)
        document.body.classList.add("dark");

        document.body.style.setProperty("--pnpsearch-iconColor", "#FFF")
    } else {
        document.body.style.setProperty("--pnpsearch-iconColor", "#000")
    }
    
    // Language support 
    document.getElementById("pnpLanguage").setAttribute("locale", app?.locale);
    
    // Comes from the Webpack Environment Plugin
    const graphScopes = JSON.parse(process.env.ENV_MSSearchAppScopes);
    const clientId = process.env.ENV_MSSearchAppClientId;

    const authConfig = {
        clientId: clientId,
        initiateLoginEndpoint: "auth-start.html"
    };
    
    const teamsUserCredential = new TeamsUserCredential(authConfig);
    
    const provider = new TeamsProvider(user, teamsUserCredential, graphScopes);
    Providers.globalProvider = provider;

    
    await provider.login()
};

appInitialize();
