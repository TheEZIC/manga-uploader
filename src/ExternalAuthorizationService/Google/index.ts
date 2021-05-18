import IAuthorizationData from "../../IAuthorizationData";
import Logger from "../../Logger";
import ExternalAuthorizationService from "../ExternalAuthorizationService";

export default class GoogleAuthorizationService extends ExternalAuthorizationService {
    name = "google";

    public async authorize(authorizationData: IAuthorizationData) {
        await this.page.waitForSelector(this.buttonSelector);
        (await this.page.$(this.buttonSelector)).click();

        //enter login
        await this.fillInput("input[type=email]", authorizationData.login);
        await this.clickBtn("#identifierNext button[type=button]");
        await this.page.waitForTimeout(2000);

        //enter password
        await this.fillInput("input[type=password]", authorizationData.password);
        await this.clickBtn("#passwordNext button[type=button]");
        await this.page.waitForTimeout(2000);

        let isGoogle = this.page.url().startsWith("https://accounts.google.com/")

        //process 2FA if we still on google address
        if (isGoogle && await this.page.$("samp.fD1Pid")) {
            const TFAText = await this.getInnerText("samp.fD1Pid");

            Logger.attention(`Google 2FA on ${this.source.name} source. Please press ${TFAText} on you phone`);
            
            let holdProgress = true;

            while (holdProgress) {
                await this.page.waitForTimeout(300);
                Logger.log("ожидаю гугл");

                isGoogle = this.page.url().startsWith("https://accounts.google.com/");

                if (!isGoogle) holdProgress = false;
            }
        }

        //waiting until we come back to manga source
        await this.page.waitForNavigation({ waitUntil: "networkidle2" });
    }
}