import chalk from "chalk";
import { fixString } from "./Utils";

const Style = {
    ERROR: chalk.bold.red,
    WARNING: chalk.yellow,
    MESSAGE: chalk.cyan,
    LOG: chalk.bold.magenta,
    SUCCESS: chalk.green,
    ATTENTION: chalk.magenta,
}

export default class Logger {
    static error(text: string) {
        console.log(Style.ERROR(`[Error] ${fixString(text)}`));
    }

    static warning(text: string) {
        console.log(Style.WARNING(`[Error] ${fixString(text)}`));
    }

    static success(text: string) {
        console.log(Style.SUCCESS(`[Success] ${fixString(text)}`));
    }

    static attention(text: string) {
        console.log(Style.ATTENTION(`[Attention] ${fixString(text)}`));
    }

    static log(text: string) {
        console.log(Style.MESSAGE(`[Success] ${fixString(text)}`));
    }
}