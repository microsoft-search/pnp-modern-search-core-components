import isEmpty from "lodash-es/isEmpty";
import { ILocalizedString } from "src/models/common/ILocalizedString";

export class LocalizedStringHelper {

    public static isLocalizedString(value: string | ILocalizedString): boolean {
        return  !isEmpty(value) 
                && typeof value === "object" 
                && "default" in (value as ILocalizedString);
    }

    public static getDefaultValue(value: string | ILocalizedString): string {

        if (LocalizedStringHelper.isLocalizedString(value)) {
            return (value as ILocalizedString).default; 
        }

        return value as string;
    }
}