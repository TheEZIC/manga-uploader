import Logger from "../../Logger";

/**
 * Wrap method to try catch block
 * @param log
 * @constructor
 */
export default function Safe(
    log: boolean = true
) {
    return function (
        target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function(): any {
            try {
                originalMethod.apply(this, arguments);
            } catch (e) {
                if (log) Logger.error(e);
            }
        }
    }
}