import ExternalAuthorizationService from "./ExternalAuthorizationService";
import prompt from "prompt";
import Logger from "../Logger";

export default abstract class ExternalAuthorizationServiceWithToken extends ExternalAuthorizationService{
    private async requestTokenFromConsole(): Promise<string> {
        const property: prompt.Schema = {
            properties: {
                token: {
                    required: true,
                    description: `Enter you ${this.name} verification token for ${this.source.name}`,
                }
            }
        }

        interface ITokenResult {
            token: string;
        }

        const result = await prompt.get([property]) as unknown as ITokenResult;
        return result.token;
    }

    protected async processTokenConfirmation(): Promise<string> {
        const token = await this.requestTokenFromConsole();
        await this.applyToken(token);

        if (!(await this.checkTokenSuccess())) {
            Logger.attention(`Token ${token} is wrong. Please try again`);
            await this.processTokenConfirmation();
        }

        return token;
    }

    protected abstract applyToken(token: string): Promise<void>;
    protected abstract checkTokenSuccess(): Promise<boolean>;
}
