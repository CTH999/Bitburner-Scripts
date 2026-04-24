/** @param {NS} ns **/

export async function main(ns) {
    const mode = ns.args[0]; //extract mode

    const SELF = ns.getScriptName(); //get name
    const JSON_OUT = "scripts_dump.json"; //name of output .json
    const TXT_OUT = "scripts_dump.txt"; //name of output text

    if (mode === "ex") { //trigger export
        await exportScripts(ns, SELF, JSON_OUT, TXT_OUT);
    } 
    else if (mode === "im") { //trigger import
        await importScripts(ns, SELF, TXT_OUT);
    } 
    else { //explain format
        ns.tprint("Usage: run script.js [ex | im]");
    }
}

async function exportScripts(ns, SELF, JSON_OUT, TXT_OUT) {

    const files = ns.ls("home", ".js");

    let result = {};

    for (const file of files) {

        // skip self (prevents recursion)
        if (file === SELF) continue;

        const content = ns.read(file);
        if (!content) continue;

        try {
            result[file] = btoa(content);
        } catch {
            ns.tprint(`Failed to encode ${file}`);
        }
    }

    const jsonString = JSON.stringify(result, null, 2);

    await ns.write(JSON_OUT, jsonString, "w");

    const packed = btoa(jsonString);

    await ns.write(TXT_OUT, packed, "w");

    ns.tprint(`Exported ${Object.keys(result).length} scripts`);
}