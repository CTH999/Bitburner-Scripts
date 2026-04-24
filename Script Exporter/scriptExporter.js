/** @param {NS} ns **/
export async function main(ns) {
    const mode = ns.args[0];

    const SELF = ns.getScriptName();
    const JSON_OUT = "scripts_dump.json";
    const TXT_OUT = "scripts_dump.txt";

    if (mode === "ex") {
        await exportScripts(ns, SELF, JSON_OUT, TXT_OUT);
    } 
    else if (mode === "im") {
        await importScripts(ns, SELF, TXT_OUT);
    } 
    else {
        ns.tprint("Usage: run script.js [ex | im]");
    }
}