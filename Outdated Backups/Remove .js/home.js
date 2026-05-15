/** @param {NS} ns **/
export async function main(ns) {

    const script = "basic.js";

    while (true) {

        const servers = scanAll(ns);

        for (const server of servers) {

            if (server === "home") continue;

            // --- try to open ports ---
            tryPort(ns, server);

            // --- attempt nuke ---
            if (!ns.hasRootAccess(server)) {
                try {
                    ns.nuke(server);
                } catch {}
            }

            if (!ns.hasRootAccess(server)) continue;

            // --- install backdoor if possible ---
            await tryBackdoor(ns, server);

            // --- deploy basic.js ---
            const maxRam = ns.getServerMaxRam(server);
            const scriptRam = ns.getScriptRam(script);

            if (maxRam < scriptRam) continue;

            await ns.scp(script, server);

            // only run if not already running
            if (!ns.isRunning(script, server)) {

                const threads = Math.floor(maxRam / scriptRam);

                if (threads > 0) {
                    ns.exec(script, server, threads, server);
                }
            }
        }

        await ns.sleep(10000); // loop every 10s
    }
}


// =========================
// ===== UTIL FUNCTIONS ====
// =========================

function scanAll(ns) {
    let discovered = new Set(["home"]);
    let stack = ["home"];

    while (stack.length > 0) {
        let s = stack.pop();

        for (let n of ns.scan(s)) {
            if (!discovered.has(n)) {
                discovered.add(n);
                stack.push(n);
            }
        }
    }

    return [...discovered];
}


function tryPort(ns, server) {
    try { if (ns.fileExists("BruteSSH.exe")) ns.brutessh(server); } catch {}
    try { if (ns.fileExists("FTPCrack.exe")) ns.ftpcrack(server); } catch {}
    try { if (ns.fileExists("relaySMTP.exe")) ns.relaysmtp(server); } catch {}
    try { if (ns.fileExists("HTTPWorm.exe")) ns.httpworm(server); } catch {}
    try { if (ns.fileExists("SQLInject.exe")) ns.sqlinject(server); } catch {}
}


// backdoor installer (safe version)
async function tryBackdoor(ns, server) {
    if (ns.getServer(server).backdoorInstalled) return;

    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(server)) return;

    try {
        // connect path
        const path = findPath(ns, "home", server);
        for (const node of path) {
            ns.singularity.connect(node);
        }

        await ns.singularity.installBackdoor();

        ns.singularity.connect("home");

    } catch {}
}


// pathfinding for backdoor
function findPath(ns, start, target) {
    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        if (node === target) return path;

        if (!visited.has(node)) {
            visited.add(node);

            for (let n of ns.scan(node)) {
                queue.push([...path, n]);
            }
        }
    }

    return [];
}