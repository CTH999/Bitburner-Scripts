/** @param {NS} ns **/
export async function main(ns) {

    const INPUT = "scripts_dump.json";
    const OUTPUT = "scripts_dump.txt";

    // 1. Read JSON file
    const content = ns.read(INPUT);

    if (!content) {
        ns.tprint(`ERROR: ${INPUT} is empty or missing`);
        return;
    }

    // 2. Encode whole file
    let encoded;
    try {
        encoded = btoa(content);
    } catch {
        ns.tprint("ERROR: Failed to encode JSON");
        return;
    }

    // 3. Save to txt (overwrite)
    await ns.write(OUTPUT, encoded, "w");

    ns.tprint(`Packed ${INPUT} → ${OUTPUT}`);
}