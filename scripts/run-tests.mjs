import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

function parseNodeVersion(version) {
    const [major, minor, patch] = version.split('.').map((n) => Number(n));
    return {
        major: Number.isFinite(major) ? major : 0,
        minor: Number.isFinite(minor) ? minor : 0,
        patch: Number.isFinite(patch) ? patch : 0,
    };
}

function shouldUseImportFlag(v) {
    // Node deprecated --loader in v18.19.0 and v20.6.0 (tsx enforces this).
    if (v.major >= 20) {
        return v.minor >= 6;
    }
    if (v.major === 18) {
        return v.minor >= 19;
    }
    return v.major > 18;
}

const nodeVersion = parseNodeVersion(process.versions.node);
const useImport = shouldUseImportFlag(nodeVersion);

const testDir = join(process.cwd(), 'src', '__tests__');
const testFiles = readdirSync(testDir)
    .filter((f) => f.endsWith('.test.ts'))
    .map((f) => join(testDir, f));

if (testFiles.length === 0) {
    console.error(`No test files found in ${testDir}`);
    process.exit(1);
}

const nodeArgs = [];
if (useImport) {
    nodeArgs.push('--import', 'tsx');
} else {
    nodeArgs.push('--loader', 'tsx');
}
nodeArgs.push('--test', ...testFiles);

const res = spawnSync(process.execPath, nodeArgs, { stdio: 'inherit' });
process.exit(res.status ?? 1);
