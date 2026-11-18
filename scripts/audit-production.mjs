import { spawnSync } from 'node:child_process';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const allowedAdvisories = new Set([
  // Remove this exception when picomatch publishes a fixed release.
  'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
]);
const args = ['audit', '--omit=dev', '--json'];
const result = isWindows
  ? spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `npm ${args.join(' ')}`], {
      encoding: 'utf8',
    })
  : spawnSync('npm', args, { encoding: 'utf8' });

if (result.error) throw result.error;

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  process.stderr.write(result.stderr || result.stdout);
  console.error('Unable to parse npm audit output.');
  process.exit(1);
}
if (report.error) {
  console.error(`npm audit failed: ${report.error.summary ?? report.error.code}`);
  process.exit(1);
}

const relevant = new Map(
  Object.entries(report.vulnerabilities ?? {}).filter(([, vulnerability]) =>
    ['high', 'critical'].includes(vulnerability.severity),
  ),
);
const allowedPackages = new Set();
let changed = true;

while (changed) {
  changed = false;
  for (const [name, vulnerability] of relevant) {
    if (allowedPackages.has(name) || vulnerability.via.length === 0) continue;
    const allowed = vulnerability.via.every((cause) =>
      typeof cause === 'string'
        ? allowedPackages.has(cause)
        : allowedAdvisories.has(cause.url),
    );
    if (allowed) {
      allowedPackages.add(name);
      changed = true;
    }
  }
}

const blocked = [...relevant.keys()].filter((name) => !allowedPackages.has(name));
if (blocked.length > 0) {
  console.error(`Non-allowlisted high/critical npm vulnerabilities: ${blocked.join(', ')}`);
  process.exit(1);
}

if (allowedPackages.size > 0) {
  console.warn(
    `Temporarily allowing GHSA-fc5q-39xc-vjpf chain (${allowedPackages.size} packages); no fix is available.`,
  );
} else {
  console.log('No high/critical production vulnerabilities.');
}
