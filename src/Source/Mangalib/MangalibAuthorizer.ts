import GoogleAuthorizationService from "../../ExternalAuthorizationService/Google";
import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import Authorizer from "../Authorizer";

export default class MangalibAuthorizer extends Authorizer {
    externalAuthorizationServices = [
        new GoogleAuthorizationService(this.source, ".social-sign .button[data-social=google]"),
    ];

    protected async authorizeByDefault(authorizationData: IAuthorizationData) {
        const [, loginInput, passwordInput] = await this.page.$$(".form__input");
        const submitBtn = await this.page.$(".form__footer .button");

        await loginInput.type(authorizationData.login);
        await passwordInput.type(authorizationData.password);
        await submitBtn!.click();

        const authorized = await this.hasAuthorization();

        if (!authorized)
            Logger.error(`Failed to authorize to ${this.source.name}`);
    }

    protected gotoAuthorizationPage = async () =>
        await this.page.click(".header__sign-in");

    public hasAuthorization = async () =>
        !!(await this.page.$(".header-right-menu__avatar"));
}