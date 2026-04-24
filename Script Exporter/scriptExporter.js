/** @param {NS} ns **/
export async function main(ns) {

    const SELF = ns.getScriptName();
    const OUTPUT = "scripts_dump.json";

    const files = ns.ls("home", ".js");

    let result = {};

    for (const file of files) {

        if (file === SELF) continue;

        const content = ns.read(file);
        if (!content) continue;

        let encoded;
        try {
            encoded = btoa(content);
        } catch {
            ns.tprint(`Failed to encode ${file}`);
            continue;
        }

        // key = filename, value = encoded content
        result[file] = encoded;
    }

    await ns.write(OUTPUT, JSON.stringify(result, null, 2), "w");

    ns.tprint(`Exported ${Object.keys(result).length} scripts to ${OUTPUT}`);
}