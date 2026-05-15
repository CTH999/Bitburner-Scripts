/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];

    if (!target) {
        ns.tprint("Usage: run smart.js SERVER");
        return;
    }

    const script = ns.getScriptName();
    const host = ns.getHostname();

    // --- deployment logic ---
    if (host === "home") {

        const hasRoot = ns.hasRootAccess(target);
        const maxRam = ns.getServerMaxRam(target);
        const scriptRam = ns.getScriptRam(script);

        if (hasRoot && maxRam >= scriptRam) {

            ns.tprint(`Deploying to ${target}...`);

            await ns.scp(script, target);

            // run 1 thread of this script on target
            ns.exec(script, target, 1, target);

            return; // stop running on home
        }
        else {
            ns.tprint("Cannot deploy to target, running on home instead.");
        }
    }

    // =========================
    // === MAIN LOGIC BELOW ====
    // =========================

    while (true) {

        const minSec = ns.getServerMinSecurityLevel(target);
        const curSec = ns.getServerSecurityLevel(target);

        const maxMoney = ns.getServerMaxMoney(target);
        const curMoney = ns.getServerMoneyAvailable(target);

        const moneyMinThreshold = maxMoney * 0.75;
        const moneyMaxTarget   = maxMoney * 0.98;
        const securityThreshold = minSec + 1;

        // Grow phase
        if (curMoney < moneyMinThreshold) {
            while (ns.getServerMoneyAvailable(target) < moneyMaxTarget) {
                await ns.grow(target);
            }
            continue;
        }

        // Weaken phase
        if (curSec > securityThreshold) {
            while (ns.getServerSecurityLevel(target) > minSec) {
                await ns.weaken(target);
            }
            continue;
        }

        // Hack phase
        await ns.hack(target);
    }
}