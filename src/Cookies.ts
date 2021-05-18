import * as fs from "fs";
import { Page } from "puppeteer";

export async function writeCookies(
    page: Page, 
    cookiesPath: string,
) {
    const client = await page.target().createCDPSession();
    const cookies = (await client.send("Network.getAllCookies"))["cookies"];

    console.log("Saving", cookies.length, "cookies");

    fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
}

export async function restoreCookies(
    page: Page, 
    cookiesPath: string,
) {
    try {
        const buf = fs.readFileSync(cookiesPath);
        const cookies = JSON.parse(buf.toString());

        console.log("Loading", cookies.length, "cookies into browser");

        await page.setCookie(...cookies);
    } catch (e) {
        console.log("[Err] restore cookie", e);
    }
}