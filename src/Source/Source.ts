import { Browser, Page } from "puppeteer";
import ExternalAuthorizationService from "../ExternalAuthorizationService/ExternalAuthorizationService";
import IAuthorizationData from "../IAuthorizationData";
import Authorizer from "./Authorizer";
import Uploader from "./Uploader";

export interface ISourceInfo {
    name: string;
    baseLink: string;
}

export default abstract class Source implements ISourceInfo {
    public readonly abstract name: string;
    public readonly abstract baseLink: string;

    public page: Page;

    constructor(
        protected browser: Browser,
    ) { }

    public async init() {
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
        await this.page.goto(this.baseLink, { waitUntil: "networkidle2" });

        this.loadAuthorizer();
        this.loadUploader();
    }

    protected authorizer: Authorizer;
    protected abstract loadAuthorizer(): void;

    public authorize = async (authorizationData: IAuthorizationData) =>
        await this.authorizer.authorize(authorizationData);

    public hasAuthorization = async (): Promise<boolean> => 
        await this.authorizer.hasAuthorization();

    protected uploader: Uploader;
    protected abstract loadUploader(): void;

    public upload = async () => await this.uploader.upload();
}