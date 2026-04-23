/** @param {NS} ns */
export async function main(ns) {
		const target = ns.args[0];
        const threads = 1;
        const home = "home";
    if (!target) {
        ns.tprint("Usage: run all.js SERVER");
        return;
    }
    if (!ns.serverExists(target)) {
        ns.tprint(`SERVER "${target}" is invalid`);
        return;
    }
    if(!ns.hasRootAccess(target)) {
        ns.tprint(`YOU DO NOT HAVE ROOT ACCES TO "${target}" SERVER`);
        return;
    }

    if(target == home) {
        ns.tprint("The home server is not a valid input")
        return;
    }
    var script = "weaken2.js";
    ns.exec(script, home, threads, target);
    var script ="grow2.js";
    ns.exec(script, home, threads, target);
    var script ="basic2.js";
    ns.exec(script, home, threads, target);
    var script = "controller.js";
    ns.exec(script, home, threads, target);
}