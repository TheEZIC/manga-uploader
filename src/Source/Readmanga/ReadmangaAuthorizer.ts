import GoogleAuthorizationService from "../../ExternalAuthorizationService/Google";
import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import Authorizer from "../Authorizer";
import VkAuthorizationService from "../../ExternalAuthorizationService/Vk";
import AsyncSafe from "../../Decorators/AsyncSafe";

export default class ReadmangaAuthorizer extends Authorizer {
    externalAuthorizationServices = [
        new GoogleAuthorizationService(this.source, "a[data-toggle=tooltip]:nth-child(4)"),
        new VkAuthorizationService(this.source, "a[data-toggle=tooltip]:nth-child(2)"),
    ];

    @AsyncSafe()
    protected async authorizeByDefault(authorizationData: IAuthorizationData) {
        const loginInput = await this.page.$("input[name=username]");
        const passwordInput = await this.page.$("input[name=password]");

        await loginInput.type(authorizationData.login);
        await passwordInput.type(authorizationData.password);

        await this.page.click(".btn.btn-success.btn-block.btn-lg");

        const authorized = await this.hasAuthorization();

        if (!authorized)
            Logger.error(`Failed to authorize to ${this.source.name}`);
    }

    protected gotoAuthorizationPage = async () => {
        await this.page.goto(`${this.source.baseLink}internal/auth`, { waitUntil: "domcontentloaded" });
    }


    public hasAuthorization = async () =>
        !!(await this.page.$(".d-none.d-xl-inline-block"));
}