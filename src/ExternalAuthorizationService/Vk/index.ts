import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import ExternalAuthorizationServiceWithToken from "../ExternalAuthorizationServiceWithToken";

export default class VkAuthorizationService extends ExternalAuthorizationServiceWithToken {
    name = "vk";

    public async authorize(authorizationData: IAuthorizationData) {
        await this.page.waitForSelector(this.buttonSelector);
        await (await this.page.$(this.buttonSelector)).click();

        await this.page.waitForNavigation();

        if (!!(await this.page.$(".oauth_form"))) {
            //authorize
            await this.fillInput("input[type=text]", authorizationData.login);
            await this.page.waitForTimeout(1000);
            await this.fillInput("input[type=password]", authorizationData.password);
            await this.page.waitForTimeout(1000);
            await this.clickBtn("button");
            await this.page.waitForNavigation();

            //process token
            await this.processTokenConfirmation();
        }

        await this.page.waitForTimeout(1000);
        await this.clickBtn(".button_indent");
        await this.page.waitForNavigation();
    }

    protected async applyToken(token: string): Promise<void> {
        //I don't know why vk left a space in class attribute
        await this.clickBtn(".option_row ");
        await this.fillInput("input[type=text]", token);
        await this.page.waitForTimeout(1000);
        await this.clickBtn("input[type=submit]");
    }

    protected async checkTokenSuccess(): Promise<boolean> {
        await this.page.waitForTimeout(2500);
        const success = !!!(await this.page.$(".SnackbarItem"));

        if (!success) {
            await this.page.evaluate(() => document.querySelector(".SnackbarItem").remove());
        }

        console.log(success);
        return success;
    }
}