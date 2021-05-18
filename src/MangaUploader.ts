import { launch as startPuppeteer, Browser } from "puppeteer";
import Logger from "./Logger";
import MangalibSource from "./Source/Mangalib";
import Source from "./Source/Source";

import data from "../authorizationData.json";
import IAuthorizationData from "./IAuthorizationData";

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

            /* if (!(await source.hasAuthorization)) {
                source.authorize();
            } */

            //source.upload();
        }

        /* this.sources[0].authorize({
            authorizeVia: "",
            login: "admin",
            password: "admin",
        }); */
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

        /* Logger.log("123")
        Logger.error("error");
        Logger.warning("warning");
        Logger.success("success");
        Logger.attention("attention"); */

        await source.authorize(authorizationData[0]);

        console.log(await source.hasAuthorization());
    }
}