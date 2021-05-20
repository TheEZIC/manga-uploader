import Logger from "../../Logger";

/**
 * Wrap async method to try catch block
 * @param log
 * @constructor
 */
export default function AsyncSafe(
    log: boolean = true
) {
    return function (
        target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        const originalMethod = descriptor.value as () => Promise<any>;

        descriptor.value = async function(): Promise<any> {
            try {
                await originalMethod.apply(this, arguments);
            } catch (e) {
                if (log) Logger.error(e);
                return await Promise.reject(e);
            }
        }
    }
}