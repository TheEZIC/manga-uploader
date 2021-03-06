import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import ExternalAuthorizationService from "../ExternalAuthorizationService";
import Safe from "../../Decorators/Safe";
import AsyncSafe from "../../Decorators/AsyncSafe";

export default class GoogleAuthorizationService extends ExternalAuthorizationService {
    name = "google";

    @AsyncSafe()
    public async authorize(authorizationData: IAuthorizationData) {
        await this.page.waitForSelector(this.buttonSelector);
        await (await this.page.$(this.buttonSelector)).click();
        await this.page.waitForNavigation();

        if (await this.source.authorizer.hasAuthorization()) {
            return;
        }

        await this.fillSection("input[type=email]", "#identifierNext button[type=button]", authorizationData.login);
        await this.fillSection("input[type=password]", "#passwordNext button[type=button]", authorizationData.password);

        let isGoogle = this.page.url().startsWith("https://accounts.google.com/");

        //process 2FA if we still on google address
        if (isGoogle && await this.page.$("samp.fD1Pid")) {
            const TFAText = await this.getInnerText("samp.fD1Pid");

            Logger.attention(`Google 2FA on ${this.source.name} source. Please press ${TFAText} on your phone`);

            let holdProgress = true;

            while (holdProgress) {
                await this.page.waitForTimeout(300);
                Logger.log("ожидаю гугл");

                isGoogle = this.page.url().startsWith("https://accounts.google.com/");

                if (!isGoogle) holdProgress = false;
            }
        }

        //waiting until we come back to manga source
        await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });
    }

    private async fillSection(
        inputSelector: string,
        btnSelector: string,
        text: string
    ) {
        await this.fillInput(inputSelector, text);
        await this.clickBtn(btnSelector);
        await this.page.waitForTimeout(2000);
    }
}