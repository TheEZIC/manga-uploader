import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import Logger from "./Logger";
import Source from "./Source/Source";
import IAuthorizationData from "./IAuthorizationData";

import MangalibSource from "./Source/Mangalib";
import RemangaSource from "./Source/Remanga";
import ReadmangaSource from "./Source/Readmanga";
import MintmangaSource from "./Source/Mintmanga";

import data from "../authorizationData.json";

let authorizationData = data as IAuthorizationData[];

export default class MangaUploader {
    private browser: Browser;
    private sources: Source[];

    constructor() {
        puppeteer.use(StealthPlugin());
    }

    async launch() {
        this.browser = await puppeteer.launch({
            //@ts-ignore
            headless: false,
            defaultViewport: {
                width: 1280,
                height: 720,
            },
        });

        this.sources = [
            new MangalibSource(this.browser),
            new RemangaSource(this.browser),
            new ReadmangaSource(this.browser),
            new MintmangaSource(this.browser),
        ];

        for (let i = 0; i < this.sources.length; i++) {
            const source = this.sources[i];
            await source.init();
            await source.authorizer.authorize(authorizationData[i]);
        }
    }

    async test() {
        this.browser = await puppeteer.launch({
            //@ts-ignore
            headless: false,
            defaultViewport: {
                width: 1280,
                height: 720,
            },
        });

        const source = new MintmangaSource(this.browser);
        await source.init();
        await source.authorizer.authorize(authorizationData[0]);

        console.log(await source.authorizer.hasAuthorization());
    }
}