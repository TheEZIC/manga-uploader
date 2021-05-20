import GoogleAuthorizationService from "../../ExternalAuthorizationService/Google";
import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import Authorizer from "../Authorizer";
import VkAuthorizationService from "../../ExternalAuthorizationService/Vk";
import AsyncSafe from "../../Decorators/AsyncSafe";

export default class MangalibAuthorizer extends Authorizer {
    externalAuthorizationServices = [
        new GoogleAuthorizationService(this.source, ".social-sign .button[data-social=google]"),
        new VkAuthorizationService(this.source, ".social-sign .button[data-social=vk]"),
    ];

    @AsyncSafe()
    protected async authorizeByDefault(authorizationData: IAuthorizationData) {
        const [, loginInput, passwordInput] = await this.page.$$(".form__input");

        await loginInput.type(authorizationData.login);
        await passwordInput.type(authorizationData.password);
        await this.page.click(".form__footer .button");

        const authorized = await this.hasAuthorization();

        if (!authorized)
            Logger.error(`Failed to authorize to ${this.source.name}`);
    }

    protected gotoAuthorizationPage = async () =>
        await this.page.click(".header__sign-in");

    public hasAuthorization = async () =>
        !!(await this.page.$(".header-right-menu__avatar"));
}