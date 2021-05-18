import GoogleAuthorizationService from "../../ExternalAuthorizationService/Google";
import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import Authorizer from "../Authorizer";

export default class RemangaAuthorizer extends Authorizer {
    externalAuthorizationServices = [
        new GoogleAuthorizationService(this.source, ".MuiButtonBase-root.MuiButton-text:nth-child(3)"),
    ];

    protected async authorizeByDefault(authorizationData: IAuthorizationData) {
        const loginInput = await this.page.$("#login");
        const passwordInput = await this.page.$("#password");

        await loginInput.type(authorizationData.login);
        await passwordInput.type(authorizationData.password);
        await this.page.click("button.MuiButton-contained");

        const authorized = await this.hasAuthorization();

        if (!authorized)
            Logger.error(`Failed to authorize to ${this.source.name}`);
    }

    protected gotoAuthorizationPage = async () =>
        await this.page.click(".MuiButtonBase-root.c26");

    public hasAuthorization = async () =>
        !!(await this.page.$(".MuiButtonBase-root[aria-label=Notifications]"));
}