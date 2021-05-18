import { Page } from "puppeteer";
import IAuthorizationData from "../IAuthorizationData";
import Source from "../Source/Source";

export default abstract class ExternalAuthorizationService {
    public abstract name: string;
    protected page: Page;

    constructor(
        protected source: Source,
        protected buttonSelector: string,
    ) {
        this.page = source.page;
    }

    public abstract authorize(authorizationData: IAuthorizationData): Promise<void>;

    protected async fillInput(selector: string, text: string, delay: number = 0) {
        await this.page.waitForSelector(selector);
        const input = await this.page.$(selector);
        await input.type(text, { delay });
    }

    protected async clickBtn(selector: string, delay: number = 0) {
        await this.page.waitForSelector(selector);
        const btn = await this.page.$(selector);
        await btn.click({ delay });
    }

    protected async getInnerText(selector: string) {
        await this.page.waitForSelector(selector);
        const element = await this.page.$(selector);
        const text = await (await element.getProperty('textContent')).jsonValue();
        return text as string;
    }
}