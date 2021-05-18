import { launch as startPuppeteer, Browser } from "puppeteer";
import Logger from "./Logger";
import MangalibSource from "./Source/Mangalib";
import Source from "./Source/Source";

import data from "../authorizationData.json";
import IAuthorizationData from "./IAuthorizationData";
import RemangaSource from "./Source/Remanga";

let authorizationData = data as IAuthorizationData[];

export default class MangaUploader {
    private browser: Browser;
    private sources: Source[];

    async launch() {
        this.browser = await startPuppeteer({ headless: false });

        this.sources = [
            new MangalibSource(this.browser),
        ];

        for await (let source of this.sources) {
            await source.init();
        }
    }

    async test() {
        this.browser = await startPuppeteer({
            headless: false ,
            defaultViewport: {
                width: 1280,
                height: 720,
            }
        });

        const source = new MangalibSource(this.browser);
        await source.init();
        await source.authorizer.authorize(authorizationData[0]);

        console.log(await source.authorizer.hasAuthorization());
    }
}