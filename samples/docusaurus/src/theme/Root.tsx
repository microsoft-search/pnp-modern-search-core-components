import { useEffect} from "react";

export default function Root({children}) {

    useEffect(() => {

        const initialize = async () => {
            
            await import('@pnp/modern-search-core/dist/es6/exports/define/pnp-search-results');
            await import('@pnp/modern-search-core/dist/es6/exports/define/pnp-search-input');
            await import('@pnp/modern-search-core/dist/es6/exports/define/pnp-search-filters');
            await import('@pnp/modern-search-core/dist/es6/exports/define/pnp-search-verticals');
    
            const { LoginType, Providers, SimpleProvider, ProviderState, Msal2Provider,TemplateHelper, registerMgtLoginComponent } = await import('@pnp/modern-search-core');
    
            const login = async () => {

                // Easy auth scenario
                try {
                    await fetch('/.auth/login');  
                } catch (error) {
                    console.error('Error while login', error);
                    return null;
                }
            }

            const logout = async () => {

                // Easy auth scenario
                try {
                    await fetch('/.auth/logout');  
        
                } catch (error) {
                    console.error('Error while logout', error);
                    return null;
                }
            }
                
            const getAuthInfo = async () => {

                // Easy auth scenario
                try {
                    const response = await fetch('/.auth/me');  
                    const payload = await response.json();  
                    return payload && payload[0];
                } catch (error) {
                    console.error('Error while getting access token', error);
                    return null;
                }
            };

            const refreshAccessToken = async () => {

                // Easy auth scenario
                try {
                    const response = await fetch('/.auth/refresh');  
                    const payload = await response.json();  
                    return payload && payload[0];
                } catch (error) {
                    console.error('Error while getting access token', error);
                    return null;
                }
            };

            const getAccessToken = async () => {

                const authInfo = await getAuthInfo();
                if (new Date(authInfo.expires_on) >= new Date()){
                    const refreshToken = await refreshAccessToken();

                    return refreshToken;
                }
                return authInfo?.access_token;
            };

            const authInfo = await getAuthInfo();

            if (authInfo) {
                const simpleProvider = new SimpleProvider(getAccessToken, login, logout);
               
                simpleProvider.getActiveAccount = () => {
                    return {
                        id: authInfo.user_id
                    }
                }

                Providers.globalProvider = simpleProvider;
                Providers.globalProvider.setState(ProviderState.SignedIn)
            
            } else {

                Providers.globalProvider = new Msal2Provider({
                    clientId: process.env.ENV_MSSearchAppClientId,
                    authority: `https://login.microsoftonline.com/${process.env.ENV_MSSearchAppTenantId}`,
                    domainHint: process.env.ENV_MSSearchAppDomain,
                    redirectUri: `${process.env.ENV_SiteUrl}`,
                    loginType: LoginType.Popup
                });
            }
    
            // To avoid conflicts with MDX
            TemplateHelper.setBindingSyntax('[[', ']]');
    
            registerMgtLoginComponent();
        }

        initialize();
    });

    return children;
}
