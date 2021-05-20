export async function sleep(timeMS: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), timeMS));
}

export function fixString(str: string): string {
    return str.split("\n").map(s => s.replace(/\t/g, '').trim()).join("\n");
}