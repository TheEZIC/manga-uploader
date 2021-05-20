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
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36");
        await this.page.goto(this.baseLink, { waitUntil: "networkidle2" });

        this.loadAuthorizer();
        this.loadUploader();
    }

    public authorizer: Authorizer;
    protected abstract loadAuthorizer(): void;

    public uploader: Uploader;
    protected abstract loadUploader(): void;
}