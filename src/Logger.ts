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
        text && console.log(Style.ERROR(`[Error] ${fixString(text)}`));
    }

    static warning(text: string) {
        text && console.log(Style.WARNING(`[Warning] ${fixString(text)}`));
    }

    static success(text: string) {
        text && console.log(Style.SUCCESS(`[Success] ${fixString(text)}`));
    }

    static attention(text: string) {
        text && console.log(Style.ATTENTION(`[Attention] ${fixString(text)}`));
    }

    static log(text: string) {
        text && console.log(Style.MESSAGE(`[Log] ${fixString(text)}`));
    }
}