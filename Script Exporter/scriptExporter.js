/** @param {NS} ns **/
export async function main(ns) {

    const SELF = ns.getScriptName();
    const JSON_OUT = "scripts_dump.json";
    const TXT_OUT = "scripts_dump.txt";

    const files = ns.ls("home", ".js");

    let result = {};

    // ----------------------------------------
    // 1. Build JSON object in memory
    // ----------------------------------------
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

        result[file] = encoded;
    }

    // ----------------------------------------
    // 2. Convert to JSON string
    // ----------------------------------------
    const jsonString = JSON.stringify(result);

    // ----------------------------------------
    // 3. Save JSON (optional artifact)
    // ----------------------------------------
    await ns.write(JSON_OUT, jsonString, "w");

    // ----------------------------------------
    // 4. Encode JSON → TXT
    // ----------------------------------------
    let packed;
    try {
        packed = btoa(jsonString);
    } catch {
        ns.tprint("Failed to encode JSON");
        return;
    }

    await ns.write(TXT_OUT, packed, "w");

    ns.tprint(`Exported ${Object.keys(result).length} scripts → JSON + TXT`);
}