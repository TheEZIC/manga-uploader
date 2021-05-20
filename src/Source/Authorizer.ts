import {Page} from "puppeteer";
import ExternalAuthorizationService from "../ExternalAuthorizationService/ExternalAuthorizationService";
import IAuthorizationData from "../IAuthorizationData";
import Logger from "../Logger";
import Source, {ISourceInfo} from "./Source";

export default abstract class Authorizer {
    protected page: Page;

    constructor(
        protected source: Source,
    ) {
        this.page = source.page;
    }

    protected externalAuthorizationServices: ExternalAuthorizationService[] = [];

    protected get availableExternalServices() {
        return this.externalAuthorizationServices.map(service => service.name).join(", ") ?? "";
    }

    public async authorize(authorizationData: IAuthorizationData): Promise<void> {
        if (await this.hasAuthorization()) {
            return Logger.success(`You are already authorized at ${this.source.name}`);
        }

        await this.gotoAuthorizationPage();

        if (authorizationData.authorizeVia === "") {
            await this.authorizeByDefault(authorizationData);
            return Logger.success(`Authorized to ${this.source.name}`);
        }

        const externalAuthorizationService = this.externalAuthorizationServices
            .find(service => service.name === authorizationData.authorizeVia);

        if (externalAuthorizationService) {
            await externalAuthorizationService.authorize(authorizationData);
            return Logger.success(`Authorized to ${this.source.name}`);
        }

        await this.page.close();
        Logger.error(`
            Authorization method "${authorizationData.authorizeVia}" for ${this.source.name} doesn't exist. Available sources: ${this.availableExternalServices}
        `);
    }

    protected abstract gotoAuthorizationPage(): Promise<void>;

    protected abstract authorizeByDefault(authorizationData: IAuthorizationData): Promise<void>;

    public abstract hasAuthorization(): Promise<boolean>;
}