import { PageOpenBehavior } from "../../../helpers/UrlHelper";
import { IDataVerticalConfiguration } from "../../../models/common/IDataVerticalConfiguration";

//#region Mock data
export const baseVerticalSettings: IDataVerticalConfiguration[] = [
    {
        key:"tab1",
        tabName: {
            default:"Tab 1",
            "fr-fr":"Onglet 1"
        },
        tabValue:"",
        isLink:false,
        linkUrl: "",
        openBehavior: PageOpenBehavior.NewTab
    },
    {
        key:"tab2",
        tabName: "Tab 2",
        tabValue:"",
        isLink:false,
        linkUrl:"",
        openBehavior: PageOpenBehavior.NewTab
    }
];
//#endregion